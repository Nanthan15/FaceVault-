from flask import Blueprint, request, jsonify, send_file
from flask import current_app as app
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from config import MONGO_URI
import datetime
import face_recognition
import numpy as np
import os

client = MongoClient(MONGO_URI)
db = client['facevault']
users = db['usersDB']

vault_bp = Blueprint('vault', __name__)

# Local storage directory
LOCAL_FILES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'files'))

@vault_bp.route('/upload', methods=['POST'])
def upload_file():
    email = request.form.get('email')
    file = request.files.get('file')
    cid = request.form.get('cid')
    fileType = request.form.get('fileType')
    size = request.form.get('size')

    if not email or not file or not cid or not fileType or not size:
        return jsonify({'error': 'Missing fields'}), 400

    # Save file locally
    filename = secure_filename(file.filename)
    user_dir = os.path.join(LOCAL_FILES_DIR, email)
    os.makedirs(user_dir, exist_ok=True)
    timestamp = datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')
    local_filename = f"{timestamp}_{filename}"
    local_path = os.path.join(user_dir, local_filename)
    file.save(local_path)

    # Ensure user exists
    user = users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Prepare file document with all required fields
    file_doc = {
        "name": filename,
        "cid": cid,
        "size": size,
        "fileType": fileType,
        "local_path": local_path,
        "modified": datetime.datetime.utcnow().isoformat()
    }

    # Push the file_doc to the files array
    result = users.update_one(
        {'email': email},
        {'$push': {'files': file_doc}}
    )

    if result.modified_count == 0:
        app.logger.error(f"Failed to update user files for {email}")
        return jsonify({'error': 'Failed to update user files'}), 500

    return jsonify({'message': 'File uploaded successfully', 'local_path': local_path}), 201

@vault_bp.route('/files', methods=['GET'])
def get_files():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = users.find_one({'email': email})
    if not user:
        # Instead of 404, return empty files array for non-existent user
        return jsonify({'files': []}), 200
    files = user.get('files', [])
    return jsonify({'files': files}), 200

@vault_bp.route('/decrypt', methods=['POST'])
def decrypt_file():
    email = request.form.get('email')
    file_cid = request.form.get('cid')
    photo = request.files.get('photo')

    user = users.find_one({'email': email})
    if not user or not photo:
        return jsonify({'error': 'Invalid request'}), 400

    # Face verification
    image = face_recognition.load_image_file(photo)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return jsonify({'error': 'No face detected'}), 400
    encoding = encodings[0]
    user_encoding = np.array(user['face_encoding'])
    matches = face_recognition.compare_faces([user_encoding], encoding)
    if not matches[0]:
        return jsonify({'error': 'Face does not match'}), 401

    # Find file path by cid (return the file doc, not just the path)
    file_doc = None
    for f in user.get('files', []):
        if f.get('cid') == file_cid:
            file_doc = f
            break

    if not file_doc:
        return jsonify({'error': 'File not found'}), 404

    # You can add decryption logic here
    return jsonify({'message': 'Decryption allowed', 'file_path': file_doc}), 200

@vault_bp.route('/download')
def download_file():
    path = request.args.get('path')
    if not path or not os.path.isfile(path):
        return jsonify({'error': 'File not found'}), 404
    return send_file(path, as_attachment=True)
