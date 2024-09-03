from flask import Flask, request, jsonify
import requests
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

db_config = {
    'user': 'eddy',
    'password': 'Eddyspassword',
    'host': 'host.minikube.internal',
    'database': 'comments'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as err:
        raise Error (f"Error connecting to MySQL: {err}")

@app.route('/add_comment', methods=['POST'])
def add_comment():
    user_id = request.headers.get('x-user-id')
    data = request.get_json()
    post_id = data.get('postId')
    content = data.get('content')
    date = data.get('date')

    if not all([post_id, content, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO comments (postId, userId, content, date) VALUES (%s, %s, %s, %s)",
            (post_id, user_id, content, date)
        )
        connection.commit()

        posts_response = requests.post("http://posts:8080/add_comment", json={"postId": post_id})
        if posts_response.status_code != 201:
            raise Error("failed to increment comment count")
        
        return jsonify({'message': 'Comment added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/get_comments/<int:post_id>', methods=['GET'])
def get_comments(post_id):
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM comments WHERE postId = %s", (post_id,))
        comments = cursor.fetchall()

        for comment in comments:
            users_response = requests.get(f"http://users:8080/get_username/{comment['userId']}")
            if users_response.status_code == 200:
                comment["username"] = users_response.json().get("username")
            else:
                raise Error("failed to get username")
            
            replies_response = requests.get(f"http://replies:8080/get_replies/{comment['commentId']}")
            if replies_response.status_code == 200:
                comment["replies"] = replies_response.json()
            else:
                raise Error("failed to get replies")

        return jsonify(comments), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/like_comment/<int:comment_id>', methods=['PATCH'])
def like_comment(comment_id):
    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE comments SET likes = likes + 1 WHERE commentId = %s", (comment_id,))
        connection.commit()
        
        return jsonify({'message': 'Comment liked successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)