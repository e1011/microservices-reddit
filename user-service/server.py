from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import jwt 
import requests
import datetime

app = Flask(__name__)

JWT_SECRET = 'p3hf9dsz2nf9dl2kc9sj27dcw23x'
JWT_ALGORITHM = 'HS256'

db_config = {
    'user': 'eddy',
    'password': 'Eddyspassword',
    'host': 'host.minikube.internal',
    'database': 'users'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as err:
        raise Error (f"Error connecting to MySQL: {err}")

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        connection.commit()
        response = requests.post(f"http://email:8080/send_email", headers={"Content-Type": "application/x-www-form-urlencoded"}, data={"to": email, "subject": "Welcome", "body": "Thanks for registering!"})
        return jsonify({'message': 'User added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/check_user', methods=['POST'])
def check_user():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT userId, password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user:
            user_id = user[0]
            stored_password = user[1]
            if stored_password == password:
                payload = {
                    'x-user-id': user_id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }
                token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

                return jsonify({'token': token, 'message': 'Authentication successful'}), 200
            else:
                return jsonify({'error': 'Wrong password'}), 401
        else:
            return jsonify({'error': 'User not found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

# this one uses jwt header to get username
@app.route('/get_current_username', methods=['GET'])
def get_current_username():
    user_id = request.headers.get('x-user-id')

    if not user_id:
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT username FROM users WHERE userId = %s", (user_id,))
        user = cursor.fetchone()

        return jsonify({'username': user['username']}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

# this gets any username by user id
@app.route('/get_username/<int:user_id>', methods=['GET'])
def get_username(user_id):
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT username FROM users WHERE userId = %s", (user_id,))
        user = cursor.fetchone()

        return jsonify({'username': user['username']}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)