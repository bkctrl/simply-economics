-- This PostgreSQL code creates a posts table and a comments table on an AWS RDS database
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_name VARCHAR(255) NOT NULL,
  author_user_id VARCHAR(255) NOT NULL,
  author_avatar_url TEXT
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  author_name VARCHAR(255) NOT NULL,
  author_user_id VARCHAR(255) NOT NULL,
  author_avatar_url TEXT
);
