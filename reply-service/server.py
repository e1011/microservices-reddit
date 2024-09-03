from flask import Flask, request, jsonify
import mysql.connector
import requests
from mysql.connector import Error

app = Flask(__name__)

db_config = {
    'user': 'eddy',
    'password': 'Eddyspassword',
    'host': 'host.minikube.internal',
    'database': 'replies'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as err:
        raise Error (f"Error connecting to MySQL: {err}")

@app.route('/add_reply', methods=['POST'])
def add_reply():
    user_id = request.headers.get('x-user-id')
    data = request.get_json()
    comment_id = data.get('commentId')
    content = data.get('content')
    date = data.get('date')

    if not all([comment_id, content, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO replies (commentId, userId, content, date) VALUES (%s, %s, %s, %s)",
            (comment_id, user_id, content, date)
        )
        connection.commit()
        return jsonify({'message': 'Reply added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/get_replies/<int:comment_id>', methods=['GET'])
def get_replies(comment_id):
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM replies WHERE commentId = %s", (comment_id,))
        replies = cursor.fetchall()

        for reply in replies:
            reply["username"] = requests.get("http://users:8080/get_username/"+str(reply["userId"])).json().get("username")

        return jsonify(replies), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/like_reply/<int:reply_id>', methods=['PATCH'])
def like_reply(reply_id):
    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE replies SET likes = likes + 1 WHERE replyId = %s", (reply_id,))
        connection.commit()
        
        return jsonify({'message': 'Reply liked successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
