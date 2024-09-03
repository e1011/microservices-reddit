from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

db_config = {
    'user': 'eddy',
    'password': 'Eddyspassword',
    'host': 'host.minikube.internal',
    'database': 'visited'
}

def connect_db():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/add_visited', methods=['POST'])
def add_visited():
    user_id = request.headers.get('x-user-id')

    data = request.get_json()
    title = data.get('title')
    post_id = data.get('postId')
    date = data.get('date')

    if not all([user_id, post_id, date]):
        return jsonify({'error': 'Missing required fields'}), 400

    connection = connect_db()

    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO visited (userId, title, postId, date) VALUES (%s, %s, %s, %s)",
            (user_id, title, post_id, date)
        )
        connection.commit()
        return jsonify({'message': 'Visited post added successfully'}), 201
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/get_visited_posts', methods=['GET'])
def get_visited_posts():
    user_id = request.headers.get('x-user-id')
    connection = connect_db()

    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT v.postId, v.title FROM visited v "
            "WHERE v.userId = %s "
            "ORDER BY v.date DESC",
            (user_id,)
        )
        visited_posts = cursor.fetchall()
        return jsonify(visited_posts), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f"Error: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)