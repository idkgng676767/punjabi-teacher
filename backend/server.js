const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'PunjabiLingo API is running' });
});

// Auth routes (stub)
app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, token: 'dummy-token', user: { id: 1, email: req.body.email } });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, token: 'dummy-token', user: { id: 1, email: req.body.email } });
});

// Lessons route (stub)
app.get('/api/lessons', (req, res) => {
  res.json([
    { id: 1, title: 'Gurmukhi Basics', description: 'Learn the first 15 Gurmukhi letters', completed: false },
    { id: 2, title: 'Greetings', description: 'Learn basic greetings in Punjabi', completed: false },
  ]);
});

// Progress route (stub)
app.get('/api/progress', (req, res) => {
  res.json({ xp: 0, level: 1, streak: 0, hearts: 5 });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});