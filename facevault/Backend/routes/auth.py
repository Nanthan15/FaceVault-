from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import face_recognition
import numpy as np
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['facevault']
users = db['usersDB']

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    role = request.form.get('role')
    company = request.form.get('company')
    photo = request.files.get('photo')

    if not username or not password or not email or not role or not company or not photo:
        return jsonify({'error': 'Missing fields'}), 400

    if users.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 409

    if users.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 409

    image = face_recognition.load_image_file(photo)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return jsonify({'error': 'No face detected'}), 400

    encoding = encodings[0]
    hashed_password = generate_password_hash(password)

    users.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password,
        "role": role,
        "company": company,
        "face_encoding": encoding.tolist()
    })
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    photo = request.files.get('photo')

    # Require all three fields
    if not email or not password or not photo:
        return jsonify({'error': 'Email, password, and photo are required'}), 400

    user = users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Password check
    if not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Face recognition check
    image = face_recognition.load_image_file(photo)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return jsonify({'error': 'No face detected'}), 400
    encoding = encodings[0]
    user_encoding = np.array(user['face_encoding'])
    matches = face_recognition.compare_faces([user_encoding], encoding)
    if not matches[0]:
        return jsonify({'error': 'Face does not match'}), 401

    return jsonify({'message': 'Login successful'}), 200