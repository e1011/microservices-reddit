from flask import Flask, request, jsonify
import mysql.connector
import requests
from mysql.connector import Error

app = Flask(__name__)

db_config = {
    'user': 'eddy',
    'password': 'Eddyspassword',
    'host': 'host.minikube.internal',
    'database': 'posts'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as err:
        raise Error(f"Error connecting to MySQL: {err}")

@app.route('/add_post', methods=['POST'])
def add_post():
    user_id = request.headers.get('x-user-id')
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    date = data.get('date')

    if not all([user_id, content, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO posts (userId, title, content, date) VALUES (%s, %s, %s, %s)",
            (user_id, title, content, date)
        )
        connection.commit()
        return jsonify({'message': 'Post added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

# get only simplified posts
@app.route('/get_posts', methods=['GET'])
def get_posts():
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM posts")
        posts = cursor.fetchall()
        
        for post in posts:
            post["username"] = requests.get(f"http://users:8080/get_username/{post["userId"]}").json().get("username")

        return jsonify(posts), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

# get the full post
@app.route('/get_post/<int:post_id>', methods=['GET'])
def get_post(post_id):
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM posts WHERE postId = %s", 
            (post_id,)
        )
        post = cursor.fetchone()

        users_response = requests.get(f"http://users:8080/get_username/{post['userId']}")
        if users_response.status_code == 200:
            post["username"] = users_response.json().get("username")
        else:
            raise Error("failed to get username")

        comments_response = requests.get(f"http://comments:8080/get_comments/{post['postId']}")
        if comments_response.status_code == 200:
            post["comments"] = comments_response.json()
        else:
           raise Error("failed to get comments")

        return jsonify(post), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/like_post/<int:post_id>', methods=['PATCH'])
def like_post(post_id):
    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE posts SET likes = likes + 1 WHERE postId = %s", (post_id,))
        connection.commit()
        
        return jsonify({'message': 'Post liked successfully'}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    post_id = data.get('postId')

    if not all([post_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()

        cursor.execute("UPDATE posts SET commentCount = commentCount + 1 WHERE postId = %s", (post_id,))
        connection.commit()

        return jsonify({'message': 'Comment added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
