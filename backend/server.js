const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Change in production

app.use(cors());
app.use(express.json());

// In-memory storage for users (in a real app, use a database)
let users = [];
let userIdCounter = 1;

// In-memory storage for lessons
const lessons = [
  {
    id: 1,
    title: 'Gurmukhi Basics',
    description: 'Learn the first 15 Gurmukhi letters',
    unit: 1,
    type: 'unit',
    letters: [
      {
        id: 1,
        title: 'ਅ (A)',
        description: 'Learn the first Gurmukhi letter',
        character: 'ਅ',
        transliteration: 'a',
        pronunciation: 'like "a" in "father"',
        exampleWord: 'ਅੱਖ',
        exampleMeaning: 'eye',
        audioUrl: '/audio/letter-a.mp3', // Placeholder
        imageUrl: '/images/letter-a.png', // Placeholder
      },
      {
        id: 2,
        title: 'ਆ (AA)',
        description: 'Learn the second Gurmukhi letter',
        character: 'ਆ',
        transliteration: 'aa',
        pronunciation: 'like "a" in "father" but longer',
        exampleWord: 'ਆਮ',
        exampleMeaning: 'mango',
        audioUrl: '/audio/letter-aa.mp3',
        imageUrl: '/images/letter-aa.png',
      },
      {
        id: 3,
        title: 'ਇ (I)',
        description: 'Learn the third Gurmukhi letter',
        character: 'ਇ',
        transliteration: 'i',
        pronunciation: 'like "i" in "sit"',
        exampleWord: 'ਇੱਕ',
        exampleMeaning: 'one',
        audioUrl: '/audio/letter-i.mp3',
        imageUrl: '/images/letter-i.png',
      },
      {
        id: 4,
        title: 'ਈ (II)',
        description: 'Learn the fourth Gurmukhi letter',
        character: 'ਈ',
        transliteration: 'ii',
        pronunciation: 'like "ee" in "see"',
        exampleWord: 'ਈਹ',
        exampleMeaning: 'this',
        audioUrl: '/audio/letter-ii.mp3',
        imageUrl: '/images/letter-ii.png',
      },
      {
        id: 5,
        title: 'ਉ (U)',
        description: 'Learn the fifth Gurmukhi letter',
        character: 'ਉ',
        transliteration: 'u',
        pronunciation: 'like "u" in "put"',
        exampleWord: 'ਉੱਲੂ',
        exampleMeaning: 'owl',
        audioUrl: '/audio/letter-u.mp3',
        imageUrl: '/images/letter-u.png',
      },
      {
        id: 6,
        title: 'ਊ (UU)',
        description: 'Learn the sixth Gurmukhi letter',
        character: 'ਊ',
        transliteration: 'uu',
        pronunciation: 'like "oo" in "food"',
        exampleWord: 'ਊਨ',
        exampleMeaning: 'wool',
        audioUrl: '/audio/letter-uu.mp3',
        imageUrl: '/images/letter-uu.png',
      },
      {
        id: 7,
        title: 'ਏ (E)',
        description: 'Learn the seventh Gurmukhi letter',
        character: 'ਏ',
        transliteration: 'e',
        pronunciation: 'like "e" in "bet"',
        exampleWord: 'ਏਥੇ',
        exampleMeaning: 'here',
        audioUrl: '/audio/letter-e.mp3',
        imageUrl: '/images/letter-e.png',
      },
      {
        id: 8,
        title: 'ਐ (AI)',
        description: 'Learn the eighth Gurmukhi letter',
        character: 'ਐ',
        transliteration: 'ai',
        pronunciation: 'like "ai" in "aisle"',
        exampleWord: 'ਐਨਕ',
        exampleMeaning: 'glasses',
        audioUrl: '/audio/letter-ai.mp3',
        imageUrl: '/images/letter-ai.png',
      },
      {
        id: 9,
        title: 'ਓ (O)',
        description: 'Learn the ninth Gurmukhi letter',
        character: 'ਓ',
        transliteration: 'o',
        pronunciation: 'like "o" in "go"',
        exampleWord: 'ਓਹ',
        exampleMeaning: 'he/she',
        audioUrl: '/audio/letter-o.mp3',
        imageUrl: '/images/letter-o.png',
      },
      {
        id: 10,
        title: 'ਔ (AU)',
        description: 'Learn the tenth Gurmukhi letter',
        character: 'ਔ',
        transliteration: 'au',
        pronunciation: 'like "ou" in "sound"',
        exampleWord: 'ਔਰਤ',
        exampleMeaning: 'woman',
        audioUrl: '/audio/letter-au.mp3',
        imageUrl: '/images/letter-au.png',
      },
      {
        id: 11,
        title: 'ਕ (KA)',
        description: 'Learn the eleventh Gurmukhi letter',
        character: 'ਕ',
        transliteration: 'ka',
        pronunciation: 'like "k" in "kite"',
        exampleWord: 'ਕਬੂਤਰ',
        exampleMeaning: 'pigeon',
        audioUrl: '/audio/letter-ka.mp3',
        imageUrl: '/images/letter-ka.png',
      },
      {
        id: 12,
        title: 'ਖ (KHA)',
        description: 'Learn the twelfth Gurmukhi letter',
        character: 'ਖ',
        transliteration: 'kha',
        pronunciation: 'like "kh" in "loch" (Scottish)',
        exampleWord: 'ਖਿੜਕੀ',
        exampleMeaning: 'window',
        audioUrl: '/audio/letter-kha.mp3',
        imageUrl: '/images/letter-kha.png',
      },
      {
        id: 13,
        title: 'ਗ (GA)',
        description: 'Learn the thirteenth Gurmukhi letter',
        character: 'ਗ',
        transliteration: 'ga',
        pronunciation: 'like "g" in "go"',
        exampleWord: 'ਗਾਇ',
        exampleMeaning: 'cow',
        audioUrl: '/audio/letter-ga.mp3',
        imageUrl: '/images/letter-ga.png',
      },
      {
        id: 14,
        title: 'ਘ (GHA)',
        description: 'Learn the fourteenth Gurmukhi letter',
        character: 'ਘ',
        transliteration: 'gha',
        pronunciation: 'like "gh" (voiced aspirated)',
        exampleWord: 'ਘਰ',
        exampleMeaning: 'house',
        audioUrl: '/audio/letter-gha.mp3',
        imageUrl: '/images/letter-gha.png',
      },
      {
        id: 15,
        title: 'ਙ (NGA)',
        description: 'Learn the fifteenth Gurmukhi letter',
        character: 'ਙ',
        transliteration: 'nga',
        pronunciation: 'like "ng" in "sing"',
        exampleWord: 'ਙਗੁਰ',
        exampleMeaning: 'whale (Sanskrit loanword)',
        audioUrl: '/audio/letter-nga.mp3',
        imageUrl: '/images/letter-nga.png',
      },
    ]
  },
  {
    id: 2,
    title: 'Greetings',
    description: 'Learn basic greetings in Punjabi',
    unit: 1,
    type: 'lesson',
    // For simplicity, we'll keep this as a simple lesson without breaking down further
  },
];

// Register a new user
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: userIdCounter++,
      email,
      name,
      password: hashedPassword,
      xp: 0,
      level: 1,
      streak: 0,
      hearts: 5,
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        xp: newUser.xp,
        level: newUser.level,
        streak: newUser.streak,
        hearts: newUser.hearts,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        hearts: user.hearts,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get user profile (protected)
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.sendStatus(404);

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    hearts: user.hearts,
  });
});

// Update user progress (e.g., after lesson completion)
app.post('/api/progress', authenticateToken, (req, res) => {
  const { xpEarned, lessonCompleted } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.sendStatus(404);

  // Update XP and level
  user.xp = (user.xp || 0) + xpEarned;
  user.level = Math.floor(user.xp / 100) + 1;

  // Update streak if lesson completed today (simplified: just increment if lessonCompleted is true)
  if (lessonCompleted) {
    user.streak = (user.streak || 0) + 1;
    // Hearts refill logic: if hearts are 0, set to 5 (or based on time, but we simplify)
    if (user.hearts === 0) {
      user.hearts = 5;
    }
  }

  res.json({
    message: 'Progress updated',
    user: {
      id: user.id,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      hearts: user.hearts,
    },
  });
});

// Get lessons
app.get('/api/lessons', (req, res) => {
  res.json(lessons);
});

// Get a specific lesson by ID
app.get('/api/lessons/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === parseInt(req.params.id));
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  res.json(lesson);
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'PunjabiLingo API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});