CREATE USER 'eddy'@'localhost' IDENTIFIED BY 'Eddyspassword';

CREATE DATABASE IF NOT EXISTS users;
GRANT ALL PRIVILEGES ON users.* TO 'eddy'@'localhost';
USE users;

CREATE TABLE users (
    userId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE DATABASE IF NOT EXISTS posts;
GRANT ALL PRIVILEGES ON posts.* TO 'eddy'@'localhost';
USE posts;

CREATE TABLE posts (
    postId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    commentCount INT NOT NULL DEFAULT 0,
    date VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users.users(userId)
);

CREATE DATABASE IF NOT EXISTS comments;
GRANT ALL PRIVILEGES ON comments.* TO 'eddy'@'localhost';
USE comments;

CREATE TABLE comments (
    commentId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL,
    userId INT NOT NULL,
    content TEXT NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    date VARCHAR(255) NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts.posts(postId),
    FOREIGN KEY (userId) REFERENCES users.users(userId)
);

CREATE DATABASE IF NOT EXISTS replies;
GRANT ALL PRIVILEGES ON replies.* TO 'eddy'@'localhost';
USE replies;

CREATE TABLE replies (
    replyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    commentId INT NOT NULL,
    userId INT NOT NULL,
    content TEXT NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    date VARCHAR(255) NOT NULL,
    FOREIGN KEY (commentId) REFERENCES comments.comments(commentId),
    FOREIGN KEY (userId) REFERENCES users.users(userId)
);

CREATE DATABASE IF NOT EXISTS visited;
GRANT ALL PRIVILEGES ON visited.* TO 'eddy'@'localhost';
USE visited;

CREATE TABLE visited (
    visitId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    date VARCHAR(255) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users.users(userId),
    FOREIGN KEY (postId) REFERENCES posts.posts(postId)
);
