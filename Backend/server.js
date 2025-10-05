const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // <--- 1. Import CORS

const app = express();
// 2. Enable CORS for the port your Vite/React app usually runs on
// If your frontend runs on 3000, 5173, etc., make sure the port is included.
// Using cors() without parameters allows all origins for now, which is usually fine for development.
app.use(cors()); 
app.use(express.json()); // built-in body parser

// It is best practice to move the secret to environment variables
const secret = process.env.JWT_SECRET || 'your-secret-key';

// In-memory user store
const users = [{ username: 'ananya', password: '1234' }];

// SIGNUP
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (users.find(u => u.username === username)) {
    // Ensuring this response is clear if the user already exists
    return res.status(409).json({ message: 'User already exists. Please log in.' }); 
  }
  
  users.push({ username, password });
  res.json({ message: 'User created successfully' });
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Token payload should include all necessary user info (username)
  const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
  res.json({ token, username: user.username }); // Optionally send username back too
});

// PROTECTED ROUTE
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: `Hello ${req.user.username}` });
});

// Note: Removed the extra res.json() call that sometimes causes issues right before listen.
app.listen(8090, () => console.log('Server running on http://localhost:8090'));
