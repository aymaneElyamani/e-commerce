from flask import request, jsonify, Blueprint
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User
from sqlalchemy.exc import IntegrityError

auth_bq = Blueprint("auth", __name__, url_prefix="/api/auth")

# Secret key for encoding and decoding JWT
SECRET_KEY = 'your-secret-key'


# Helper function to encode JWT
def encode_jwt(user_data):
    expiration = datetime.now() + timedelta(days=10)  # Token expires in 10 days
    token = jwt.encode({
        'user': user_data,
        'exp': expiration
    }, SECRET_KEY, algorithm='HS256')

    # PyJWT v1 returns bytes; v2 returns str
    if isinstance(token, bytes):
        token = token.decode('utf-8')

    return token


# Helper function to decode JWT
def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# Register route
@auth_bq.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = generate_password_hash(data.get('password'))

    db = get_db()
    try:
        # Create new user using ORM
        new_user = User(email=email, password=password)
        db.add(new_user)
        db.commit()
        return jsonify({"message": "User registered"}), 201
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# Login route
@auth_bq.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        print(f"Attempting login for email: {email}")

        db = get_db()
        try:
            # Query user using ORM
            user = db.query(User).filter(User.email == email).first()

            # If user exists and password is correct
            if user and check_password_hash(user.password, password):
                # Only include safe fields inside the JWT
                jwt_payload = {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name
                }

                token = encode_jwt(jwt_payload)

                return jsonify({
                    "message": "Login successful",
                    "token": token,
                    "user": jwt_payload
                }), 200

            return jsonify({"error": "Invalid credentials"}), 401
        finally:
            db.close()
        
    except Exception as e:
        return jsonify({"error": f"Login error: {str(e)}"}), 500


@auth_bq.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')  # Get token from Authorization header
    
    # Ensure the token is in the correct format 'Bearer <token>'
    if not token:
        return jsonify({"error": "Token missing"}), 400

    # Extract token from 'Bearer <token>'
    token = token.split(" ")[1] if " " in token else token

    # Decode JWT
    decoded = decode_jwt(token)
    if decoded:
        return jsonify({"user": decoded['user']}), 200

    return jsonify({"error": "Invalid or expired token"}), 401


# Logout route (invalidate the token client-side)
@auth_bq.route('/logout', methods=['GET'])
def logout():
    return jsonify({"message": "Logged out"}), 200


# Get all users
@auth_bq.route('/users', methods=['GET'])
def get_all_users():
    db = get_db()
    try:
        # Query all users using ORM
        users = db.query(User).all()
        
        # Convert to list of dicts
        users_list = [{"id": u.id, "email": u.email, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# Update user by id
@auth_bq.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    db = get_db()
    try:
        # Query user using ORM
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Update fields
        user.email = email
        if password:
            user.password = generate_password_hash(password)
        
        db.commit()
        return jsonify({"message": "User updated"}), 200
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


# Delete user by id
@auth_bq.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db()
    try:
        # Query and delete user using ORM
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.delete(user)
        db.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
