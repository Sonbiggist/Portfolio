import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Database setup
const db = new Database('portfolio.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    title TEXT,
    about TEXT,
    experience TEXT,
    avatar_url TEXT,
    contact_link TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT -- 'image' or 'video'
  );

  CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    title TEXT,
    description TEXT,
    media_url TEXT,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  -- Add contact_link column if it doesn't exist
  -- We use a try-catch in JS to handle this since SQLite doesn't have IF NOT EXISTS for columns
`);

try {
  db.exec("ALTER TABLE profile ADD COLUMN contact_link TEXT");
} catch (e) {
  // Ignore error if column already exists
}

try {
  // Update admin password if it exists
  db.exec("UPDATE users SET password = 'Sonkk1610@' WHERE username = 'sonkk1610'");
} catch (e) {}

db.exec(`
  -- Insert default admin if not exists
  INSERT OR IGNORE INTO users (username, password) VALUES ('sonkk1610', 'Sonkk1610@');
  
  -- Insert default profile if not exists
  INSERT OR IGNORE INTO profile (id, name, title, about, experience, avatar_url, contact_link) 
  VALUES (1, 'John Doe', 'Creative Director', 'Welcome to my portfolio.', '10+ years of experience.', '', 'https://facebook.com');
`);

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  
  if (user) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Profile
app.get('/api/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile);
});

app.put('/api/profile', authenticateToken, upload.single('avatar'), (req, res) => {
  const { name, title, about, experience, contact_link } = req.body;
  let avatar_url = req.body.avatar_url;

  if (req.file) {
    avatar_url = '/uploads/' + req.file.filename;
  }

  db.prepare('UPDATE profile SET name = ?, title = ?, about = ?, experience = ?, avatar_url = ?, contact_link = ? WHERE id = 1')
    .run(name, title, about, experience, avatar_url, contact_link);
  
  res.json({ success: true, avatar_url });
});

// Categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name, type } = req.body;
  const result = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)').run(name, type);
  res.json({ id: result.lastInsertRowid, name, type });
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  // Also delete associated items
  db.prepare('DELETE FROM portfolio_items WHERE category_id = ?').run(id);
  res.json({ success: true });
});

// Portfolio Items
app.get('/api/portfolio', (req, res) => {
  const items = db.prepare(`
    SELECT p.*, c.name as category_name, c.type as category_type 
    FROM portfolio_items p 
    JOIN categories c ON p.category_id = c.id
  `).all();
  res.json(items);
});

app.post('/api/portfolio', authenticateToken, upload.single('media'), (req, res) => {
  const { category_id, title, description } = req.body;
  let media_url = '';

  if (req.file) {
    media_url = '/uploads/' + req.file.filename;
  }

  const result = db.prepare('INSERT INTO portfolio_items (category_id, title, description, media_url) VALUES (?, ?, ?, ?)')
    .run(category_id, title, description, media_url);
  
  res.json({ id: result.lastInsertRowid, category_id, title, description, media_url });
});

app.delete('/api/portfolio/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const item: any = db.prepare('SELECT media_url FROM portfolio_items WHERE id = ?').get(id);
  
  if (item && item.media_url) {
    const filePath = path.join(__dirname, item.media_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  db.prepare('DELETE FROM portfolio_items WHERE id = ?').run(id);
  res.json({ success: true });
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
