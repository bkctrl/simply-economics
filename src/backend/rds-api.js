import pg from "pg";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "connect-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
      "style-src-elem": ["'self'", "data:"],
      "script-src": ["'unsafe-inline'", "'self'"],
      "object-src": ["'none'"],
    },
  })
);

const client = new pg.Client({
  user: import.meta.env.VITE_RDS_USER,
  host: import.meta.env.VITE_RDS_HOST,
  database: import.meta.env.VITE_RDS_DATABASE,
  password: import.meta.env.VITE_RDS_PASSWORD,
  port: import.meta.env.VITE_RDS_PORT,
  ssl: {
    rejectUnauthorized: false, 
  },
});

await client.connect();

// Fetch all posts
app.get('/posts', async (req, res) => {
  try {
    console.log("fetching posts");
    const result = await client.query('SELECT * FROM posts ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new post
app.post('/add-post', async (req, res) => {
  try {
    const { title, content, author_name, author_user_id, author_avatar_url } = req.body;
    // Sync the sequence first
    await client.query(`
      SELECT setval(pg_get_serial_sequence('posts', 'id'), COALESCE((SELECT MAX(id) FROM posts) + 1, 1), false);
    `);
    const result = await client.query(
      'INSERT INTO posts (title, content, author_name, author_user_id, author_avatar_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [title, content, author_name, author_user_id, author_avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit an existing post
app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    console.log("updating post:", id);
    await client.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [title, content, id]
    );
    console.log("updated post:", id);
    res.status(200).json({ message: 'Post updated' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("deleting post:", id);
    await client.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(200).json({ message: 'Post deleted' });
    console.log("deleted post:", id);
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch comments for a specific post
app.get('/comments', async (req, res) => {
  try {
    const { postId } = req.query;
    console.log("fetching comments for post:", postId);
    const result = await client.query('SELECT * FROM comments WHERE post_id = $1', [postId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a comment to a specific post
app.post('/add-comment', async (req, res) => {
  try {
    const { postId, content, author_user_id, author_name, author_avatar_url } = req.body;
    console.log("adding comment to post:");
    console.log("adding comment to post:", postId);
    await client.query(
      'INSERT INTO comments (post_id, content, author_user_id, author_name, author_avatar_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [postId, content, author_user_id, author_name, author_avatar_url]
    );
    console.log("Comment added");
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;

// Enable for local testing
// app.listen(4000, () => {
//   console.log("Server running on port 4000");
// });
