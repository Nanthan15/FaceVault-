from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['facevault']
users = db['usersDB']

connection_bp = Blueprint('connection', __name__)

@connection_bp.route('/api/send-request', methods=['POST'])
def send_request():
    data = request.json
    from_id = data.get('from_id')
    to_id = data.get('to_id')
    if not from_id or not to_id:
        return jsonify({'error': 'Missing from_id or to_id'}), 400

    # Add to sent_requests of sender
    users.update_one(
        {'_id': ObjectId(from_id)},
        {'$addToSet': {'sent_requests': ObjectId(to_id)}}
    )
    # Add to received_requests of receiver
    users.update_one(
        {'_id': ObjectId(to_id)},
        {'$addToSet': {'received_requests': ObjectId(from_id)}}
    )
    return jsonify({'message': 'Request sent'}), 200

@connection_bp.route('/api/received-requests/<user_id>', methods=['GET'])
def get_received_requests(user_id):
    user = users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    received_ids = user.get('received_requests', [])
    # Get user info for each sender
    senders = list(users.find({'_id': {'$in': received_ids}}, {'password': 0, 'face_encoding': 0}))
    # Convert ObjectId fields to string for frontend
    for sender in senders:
        sender['_id'] = str(sender['_id'])
        for k in ['sent_requests', 'received_requests', 'connections']:
            if k in sender:
                sender[k] = [str(x) for x in sender[k]]
    return jsonify({'requests': senders}), 200

@connection_bp.route('/api/all-users', methods=['GET'])
def all_users():
    users_list = list(users.find({}, {'password': 0, 'face_encoding': 0}))
    for u in users_list:
        u['_id'] = str(u['_id'])
        # Convert ObjectId lists to string
        for k in ['sent_requests', 'received_requests', 'connections']:
            if k in u:
                u[k] = [str(x) for x in u[k]]
    return jsonify({'users': users_list}), 200

@connection_bp.route('/api/user-by-email', methods=['GET'])
def user_by_email():
    email = request.args.get('email')
    user = users.find_one({'email': email}, {'password': 0, 'face_encoding': 0})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user['_id'] = str(user['_id'])
    for k in ['sent_requests', 'received_requests', 'connections']:
        if k in user:
            user[k] = [str(x) for x in user[k]]
    return jsonify({'user': user}), 200

@connection_bp.route('/api/user-by-id', methods=['GET'])
def user_by_id():
    user_id = request.args.get('id')
    if not user_id:
        return jsonify({'error': 'Missing id'}), 400
    user = users.find_one({'_id': ObjectId(user_id)}, {'password': 0, 'face_encoding': 0})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user['_id'] = str(user['_id'])
    for k in ['sent_requests', 'received_requests', 'connections']:
        if k in user:
            user[k] = [str(x) for x in user[k]]
    return jsonify({'user': user}), 200

@connection_bp.route('/api/accept-request', methods=['POST'])
def accept_request():
    data = request.json
    receiver_id = data.get('receiver_id')  # The user accepting the request
    sender_id = data.get('sender_id')      # The user who sent the request

    if not receiver_id or not sender_id:
        return jsonify({'error': 'Missing receiver_id or sender_id'}), 400

    receiver_oid = ObjectId(receiver_id)
    sender_oid = ObjectId(sender_id)

    # Remove from sent_requests and received_requests
    users.update_one(
        {'_id': sender_oid},
        {'$pull': {'sent_requests': receiver_oid}}
    )
    users.update_one(
        {'_id': receiver_oid},
        {'$pull': {'received_requests': sender_oid}}
    )

    # Add to connections for both users
    users.update_one(
        {'_id': sender_oid},
        {'$addToSet': {'connections': receiver_oid}}
    )
    users.update_one(
        {'_id': receiver_oid},
        {'$addToSet': {'connections': sender_oid}}
    )

    return jsonify({'message': 'Connection accepted'}), 200

@connection_bp.route('/api/connections/<user_id>', methods=['GET'])
def get_connections(user_id):
    user = users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    connection_ids = user.get('connections', [])
    connections = list(users.find({'_id': {'$in': connection_ids}}, {'password': 0, 'face_encoding': 0}))
    for conn in connections:
        conn['_id'] = str(conn['_id'])
        for k in ['sent_requests', 'received_requests', 'connections']:
            if k in conn:
                conn[k] = [str(x) for x in conn[k]]
    return jsonify({'connections': connections}), 200
