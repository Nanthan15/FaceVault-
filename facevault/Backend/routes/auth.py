from flask import Blueprint, request, render_template, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import face_recognition
import numpy as np
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client['facevault']
users = db['users']

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        email = request.form['email']
        photo = request.files['photo']
        
        # Extract facial encoding
        image = face_recognition.load_image_file(photo)
        encoding = face_recognition.face_encodings(image)[0]

        users.insert_one({
            "username": username,
            "email": email,
            "password": password,
            "face_encoding": encoding.tolist()
        })
        return redirect('/auth/login')
    return render_template('register.html')
