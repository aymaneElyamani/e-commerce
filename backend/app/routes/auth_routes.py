from flask import request, jsonify, Blueprint
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
from datetime import datetime, timedelta
from app import get_db

auth_bq = Blueprint("auth", __name__, url_prefix="/api/auth")

# Secret key for encoding and decoding JWT
SECRET_KEY = 'your-secret-key'

# Helper function to encode JWT
def encode_jwt(user_data):
    expiration = datetime.utcnow() + timedelta(days=10)  # Token expires in 10 days
    return jwt.encode({
        'user': user_data,
        'exp': expiration
    }, SECRET_KEY, algorithm='HS256')

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

    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute('INSERT INTO utilisateurs (email, password) VALUES (%s, %s)', (email, password))
        conn.commit()
        return jsonify({"message": "User registered"}), 201
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Login route
@auth_bq.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT password , email , id , name  FROM utilisateurs WHERE email = %s', (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and check_password_hash(user["password"], password):  # Assuming the password is in index 1 of the tuple
        token = encode_jwt(user)  # Create JWT token
        return jsonify({"message": "Login successful", "token": token , "user" :  user})  # Send token to the client
    
    return jsonify({"error": "Invalid credentials"}), 401
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
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute('SELECT id, email  , created_at FROM utilisateurs')  # Select only necessary fields
        users = cur.fetchall()
        # Convert to list of dicts
        users_list = [{"id": u["id"], "email": u["email"] , "created_at" : u["created_at"]} for u in users]
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Update user by id
@auth_bq.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db()
    cur = conn.cursor()
    try:
        if password:
            password_hash = generate_password_hash(password)
            cur.execute(
                'UPDATE utilisateurs SET email=%s, password=%s WHERE id=%s',
                (email, password_hash, user_id)
            )
        else:
            # If password not provided, update only email
            cur.execute(
                'UPDATE utilisateurs SET email=%s WHERE id=%s',
                (email, user_id)
            )
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User updated"}), 200
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Delete user by id
@auth_bq.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute('DELETE FROM utilisateurs WHERE id=%s', (user_id,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()
