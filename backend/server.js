const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { loadState, persistState } = require('./storage');
const { scoreSpeechAttempt, scoreHandwritingAttempt } = require('./practice_scoring');

const app = express();
const PORT = process.env.PORT || 5001;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Database-backed user storage loaded through the storage adapter.
const initialState = loadState();
let users = initialState.users;
let userIdCounter = initialState.userIdCounter;

function saveCurrentState() {
  persistState({ users, userIdCounter });
}

// Lesson data structured according to PunjabiLingo curriculum plan
const lessons = [
  // Unit 1: Gurmukhi Basics (Script)
  {
    id: 1,
    title: 'Gurmukhi Basics',
    description: 'Learn the first 15 Gurmukhi letters',
    unit: 1,
    type: 'unit',
    category: 'script',
    xpReward: 50,
    letters: [
      { id: 1, title: 'ਅ (A)', character: 'ਅ', transliteration: 'a', pronunciation: 'like "a" in "father"', exampleWord: 'ਅੱਖ', exampleMeaning: 'eye', audioUrl: '/audio/letter-a.mp3', imageUrl: '/images/letter-a.png' },
      { id: 2, title: 'ਆ (AA)', character: 'ਆ', transliteration: 'aa', pronunciation: 'like "a" in "father" but longer', exampleWord: 'ਆਮ', exampleMeaning: 'mango', audioUrl: '/audio/letter-aa.mp3', imageUrl: '/images/letter-aa.png' },
      { id: 3, title: 'ਇ (I)', character: 'ਇ', transliteration: 'i', pronunciation: 'like "i" in "sit"', exampleWord: 'ਇੱਕ', exampleMeaning: 'one', audioUrl: '/audio/letter-i.mp3', imageUrl: '/images/letter-i.png' },
      { id: 4, title: 'ਈ (II)', character: 'ਈ', transliteration: 'ii', imageUrl: '/images/letter-i.png' },
      { id: 4, title: 'ਈ (II)', character: 'ਈ', transliteration: 'ii', pronunciation: 'like "ee" in "see"', exampleWord: 'ਈਹ', exampleMeaning: 'this', audioUrl: '/audio/letter-ii.mp3', imageUrl: '/images/letter-ii.png' },
      { id: 5, title: 'ਉ (U)', character: 'ਉ', transliteration: 'u', pronunciation: 'like "u" in "put"', exampleWord: 'ਉੱਲੂ', exampleMeaning: 'owl', audioUrl: '/audio/letter-u.mp3', imageUrl: '/images/letter-u.png' },
      { id: 6, title: 'ਊ (UU)', character: 'ਊ', transliteration: 'uu', pronunciation: 'like "oo" in "food"', exampleWord: 'ਊਨ', exampleMeaning: 'wool', audioUrl: '/audio/letter-uu.mp3', imageUrl: '/images/letter-uu.png' },
      { id: 7, title: 'ਏ (E)', character: 'ਏ', transliteration: 'e', pronunciation: 'like "e" in "bet"', exampleWord: 'ਏਥੇ', exampleMeaning: 'here', audioUrl: '/audio/letter-e.mp3', imageUrl: '/images/letter-e.png' },
      { id: 8, title: 'ਐ (AI)', character: 'ਐ', transliteration: 'ai', pronunciation: 'like "ai" in "aisle"', exampleWord: 'ਐਨਕ', exampleMeaning: 'glasses', audioUrl: '/audio/letter-ai.mp3', imageUrl: '/images/letter-ai.png' },
      { id: 9, title: 'ਓ (O)', character: 'ਓ', transliteration: 'o', pronunciation: 'like "o" in "go"', exampleWord: 'ਓਹ', exampleMeaning: 'he/she', audioUrl: '/audio/letter-o.mp3', imageUrl: '/images/letter-o.png' },
      { id: 10, title: 'ਔ (AU)', character: 'ਔ', transliteration: 'au', pronunciation: 'like "ou" in "sound"', exampleWord: 'ਔਰਤ', exampleMeaning: 'woman', audioUrl: '/audio/letter-au.mp3', imageUrl: '/images/letter-au.png' },
      { id: 11, title: 'ਕ (KA)', character: 'ਕ', transliteration: 'ka', pronunciation: 'like "k" in "kite"', exampleWord: 'ਕਬੂਤਰ', exampleMeaning: 'pigeon', audioUrl: '/audio/letter-ka.mp3', imageUrl: '/images/letter-ka.png' },
      { id: 12, title: 'ਖ (KHA)', character: 'ਖ', transliteration: 'kha', pronunciation: 'like "kh" in "loch" (Scottish)', exampleWord: 'ਖਿੜਕੀ', exampleMeaning: 'window', audioUrl: '/audio/letter-kha.mp3', imageUrl: '/images/letter-kha.png' },
      { id: 13, title: 'ਗ (GA)', character: 'ਗ', transliteration: 'ga', pronunciation: 'like "g" in "go"', exampleWord: 'ਗਾਇ', exampleMeaning: 'cow', audioUrl: '/audio/letter-ga.mp3', imageUrl: '/images/letter-ga.png' },
      { id: 14, title: 'ਘ (GHA)', character: 'ਘ', transliteration: 'gha', pronunciation: 'like "gh" (voiced aspirated)', exampleWord: 'ਘਰ', exampleMeaning: 'house', audioUrl: '/audio/letter-gha.mp3', imageUrl: '/images/letter-gha.png' },
      { id: 15, title: 'ਙ (NGA)', character: 'ਙ', transliteration: 'nga', pronunciation: 'like "ng" in "sing"', exampleWord: 'ਙਗੁਰ', exampleMeaning: 'whale (Sanskrit loanword)', audioUrl: '/audio/letter-nga.mp3', imageUrl: '/images/letter-nga.png' }
    ]
  },
  
  // Unit 1: Greetings & Introductions (Conversation)
  {
    id: 2,
    title: 'Greetings & Introductions',
    description: 'Learn basic greetings and how to introduce yourself',
    unit: 1,
    type: 'lesson',
    category: 'conversation',
    xpReward: 30,
    phrases: [
      { id: 1, punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', transliteration: 'Sat Sri Akal', english: 'Hello / Goodbye (formal Sikh greeting)', audioUrl: '/audio/greeting-satsriakal.mp3', pronunciationTip: 'Saht sree ah-kal', culturalNote: 'Traditional Sikh greeting meaning "God is Truth"' },
      { id: 2, punjabi: 'ਕਿਵੇਂ ਹੋ?', transliteration: 'Kiven ho?', english: 'How are you?', audioUrl: '/audio/greeting-kivenho.mp3', pronunciationTip: 'Kee-ven ho?', response: 'ਮੈਂ ਠੀਕ ਹਾਂ (Main theek haan) - I am fine' },
      { id: 3, punjabi: 'ਮੇਰਾ ਨਾਮ [ਨਾਮ] ਹੈ', transliteration: 'Mera naam [naam] hai', english: 'My name is [name]', audioUrl: '/audio/greeting-meranaam.mp3', pronunciationTip: 'May-rah naam [naam] hiye' },
      { id: 4, punjabi: 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?', transliteration: 'Tuhada naam ki hai?', english: 'What is your name?', audioUrl: '/audio/greeting-tuhadanaam.mp3', pronunciationTip: 'Too-ha-da naam kee hiye?' },
      { id: 5, punjabi: 'ਧਨਵਾਦ', transliteration: 'Dhanvaad', english: 'Thank you', audioUrl: '/audio/greeting-dhanvaad.mp3', pronunciationTip: 'Dhun-vaad' }
    ]
  },
  
  // Unit 1: Numbers 1-10 (Vocabulary)
  {
    id: 3,
    title: 'Numbers 1-10',
    description: 'Learn to count from 1 to 10 in Punjabi',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 25,
    numbers: [
      { punjabi: 'ਇੱਕ', transliteration: 'Ik', english: 'One', pronunciation: 'Ik' },
      { punjabi: 'ਦੋ', transliteration: 'Do', english: 'Two', pronunciation: 'Do' },
      { punjabi: 'ਤੀਨ', transliteration: 'Tin', english: 'Three', pronunciation: 'Teen' },
      { punjabi: 'ਚਾਰ', transliteration: 'Char', english: 'Four', pronunciation: 'Chaar' },
      { punjabi: 'ਪੰਜ', transliteration: 'Panj', english: 'Five', pronunciation: 'Punj' },
      { punjabi: 'ਛੇ', transliteration: 'Chhe', english: 'Six', pronunciation: 'Chay' },
      { punjabi: 'ਸੱਤ', transliteration: 'Satt', english: 'Seven', pronunciation: 'Sutt' },
      { punjabi: 'ਅੱਠ', transliteration: 'Atth', english: 'Eight', pronunciation: 'Utth' },
      { punjabi: 'ਨੌਂ', transliteration: 'Nau', english: 'Nine', pronunciation: 'Now' },
      { punjabi: 'ਦਸ', transliteration: 'Das', english: 'Ten', pronunciation: 'Dus' }
    ]
  },
  
  // Unit 1: Family Members (Vocabulary)
  {
    id: 4,
    title: 'Family Members',
    description: 'Learn names of family members and relationships',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 30,
    words: [
      { punjabi: 'ਪਿਤਾ', transliteration: 'Pita', english: 'Father', pronunciation: 'Pee-ta' },
      { punjabi: 'ਮਾਤਾ', transliteration: 'Mata', english: 'Mother', pronunciation: 'Ma-ta' },
      { punjabi: 'ਭਰਾ', transliteration: 'Bhara', english: 'Brother', pronunciation: 'Bha-ra' },
      { punjabi: 'ਭੈਣ', transliteration: 'Bhain', english: 'Sister', pronunciation: 'Bhain' },
      { punjabi: 'ਪੁੱਤਰ', transliteration: 'Putar', english: 'Son', pronunciation: 'Pu-tar' },
      { punjabi: 'ਧੀ', transliteration: 'Dhee', english: 'Daughter', pronunciation: 'Dhee' },
      { punjabi: 'ਦਾਦਾ', transliteration: 'Dada', english: 'Grandfather', pronunciation: 'Da-da' },
      { punjabi: 'ਦਾਦੀ', transliteration: 'Dadi', english: 'Grandmother', pronunciation: 'Da-di' },
      { punjabi: 'ਮਾਮਾ', transliteration: 'Mama', english: 'Maternal Uncle', pronunciation: 'Ma-ma' },
      { punjabi: 'ਮਾਮੀ', transliteration: 'Mami', english: 'Maternal Aunt', pronunciation: 'Ma-mi' }
    ]
  },
  
  // Unit 1: Food & Eating (Vocabulary)
  {
    id: 5,
    title: 'Food & Eating',
    description: 'Learn common food items and eating-related phrases',
    unit: 1,
    type: 'lesson',
    category: 'vocabulary',
    xpReward: 35,
    words: [
      { punjabi: 'ਰੋਟੀ', transliteration: 'Roti', english: 'Bread', pronunciation: 'Ro-tee' },
      { punjabi: 'ਦਾਲ', transliteration: 'Dal', english: 'Lentils', pronunciation: 'Daal' },
      { punjabi: 'ਸਾਬ਼ੀ', transliteration: 'Sabzi', english: 'Vegetables', pronunciation: 'Sab-zee' },
      { punjabi: 'ਮਾਂਸ', transliteration: 'Maans', english: 'Meat', pronunciation: 'Maans' },
      { punjabi: 'ਚਾਵਲ', transliteration: 'Chawal', english: 'Rice', pronunciation: 'Cha-val' },
      { punjabi: 'ਦੁੱਧ', transliteration: 'Dudh', english: 'Milk', pronunciation: 'Dudh' },
      { punjabi: 'ਲੱਸੀ', transliteration: 'Lassi', english: 'Buttermilk', pronunciation: 'Las-see' },
      { punjabi: 'ਚਾਹ', transliteration: 'Chah', english: 'Tea', pronunciation: 'Chah' },
      { punjabi: 'ਕਾਫੀ', transliteration: 'Cafee', english: 'Coffee', pronunciation: 'Cafee' },
      { punjabi: 'ਨਮਕ', transliteration: 'Namak', english: 'Salt', pronunciation: 'Na-mak' }
    ]
  },
  
  // Unit 2: Past Tense Basics (Grammar)
  {
    id: 6,
    title: 'Past Tense Basics',
    description: 'Learn to form and use simple past tense in Punjabi',
    unit: 2,
    type: 'lesson',
    category: 'grammar',
    xpReward: 40,
    grammarPoints: [
      { rule: 'Verb +ਿਆ/ੀ', example: 'ਕਿਆ (kita) - did/made', explanation: 'Add iya/ii to verb stem for masculine/feminine' },
      { rule: 'Subject + Object + Verb', example: 'ਮੈਂ ਨੇ ਕਿਤਾਬ ਪੜ੍ਹੀ (Main ne kitab parhi) - I read the book' },
      { rule: 'Time indicators: ਕੱਲ (kal) - yesterday, ਪਿਛਲੇ ਰਾਤ (pichhle raat) - last night' }
    ],
    examples: [
      { punjabi: 'ਮੈਂ ਖਾਣਾ ਖਾਇਆ', transliteration: 'Main khaana khaaya', english: 'I ate food' },
      { punjabi: 'ਉਹ ਸਕੂਲ ਗਿਆ', transliteration: 'Uh school gaya', english: 'He went to school' },
      { punjabi: 'ਅਸੀਂ ਫਿਲਮ ਦੇਖੀ', transliteration: 'Asin film dekhi', english: 'We watched a movie' }
    ]
  },
  
  // Unit 2: Future Tense (Grammar)
  {
    id: 7,
    title: 'Future Tense',
    description: 'Learn to express future actions in Punjabi',
    unit: 2,
    type: 'lesson',
    category: 'grammar',
    xpReward: 40,
    grammarPoints: [
      { rule: 'Verb +ੇਗਾ/ੇਗੀ', example: 'ਕਰੇਗਾ/ਕਰੇਗੀ (karega/karegi) - will do' },
      { rule: 'Future time indicators: ਕੱਲ (kal) - tomorrow, ਭਵਿੱਖ (bhavishkh) - future' }
    ],
    examples: [
      { punjabi: 'ਮੈਂ ਕੱਲ ਜਾਣਗਾ', transliteration: 'Main kal jaunga', english: 'I will go tomorrow' },
      { punjabi: 'ਉਹੀ ਕਿਸੇ ਨੇਹਰੂ ਪੰਜਾਬ ਚਲੇਗਾ', transliteration: 'Uski dost Canada jaegi', english: 'His friend will go to Canada' },
      { punjabi: 'ਅਸੀਂ ਕੱਲ ਮਿਲੇਗੇ', transliteration: 'Asin kal milenge', english: 'We will meet tomorrow' }
    ]
  },
  
  // Unit 3: Punjabi Cuisine (Culture)
  {
    id: 8,
    title: 'Punjabi Cuisine',
    description: 'Explore traditional Punjabi dishes and cooking terms',
    unit: 3,
    type: 'lesson',
    category: 'culture',
    xpReward: 50,
    words: [
      { punjabi: 'ਮੱਕੀ ਦੀ ਰੋਟੀ', transliteration: 'Makki di roti', english: 'Corn flour bread', pronunciation: 'Muk-kee dee ro-tee' },
      { punjabi: 'ਸਰਸੋ ਦਾ ਸਾਗ', transliteration: 'Sarson da saag', english: 'Mustard greens curry', pronunciation: 'Sar-son da saag' },
      { punjabi: 'ਲਸੀ', transliteration: 'Lassi', english: 'Sweet yogurt drink', pronunciation: 'Las-see' },
      { punjabi: 'ਅਮ੍ਰਿਤਸਰੀ ਮੱਛੀ', transliteration: 'Amritsari machi', english: 'Amritsari fish fry', pronunciation: 'Am-rit-sa-ree mach-chi' },
      { punjabi: 'ਪੰਜਾਬੀ ਛੋਲਾ', transliteration: 'Punjabi chola', english: 'Spicy chickpea curry', pronunciation: 'Pun-jaa-bee cho-la' },
      { punjabi: 'ਚੋਲੇ ਭATURE', transliteration: 'Chole bhature', english: 'Spicy chickpeas with fried bread', pronunciation: 'Cho-lay bh-a-ture' },
      { punjabi: 'ਗੁਲਾਬ ਜਾਮੁਨ', transliteration: 'Gulab jamun', english: 'Sweet milk-solid balls', pronunciation: 'Gu-laab ja-mun' },
      { punjabi: 'ਜਲਾਬੀ', transliteration: 'Jalebi', english: 'Crispy sweet spirals', pronunciation: 'Ja-le-bee' }
    ]
  }
];

// User registration endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
      lastLogin: new Date(),
      lastLessonCompleted: null,
      totalLessonsCompleted: 0,
      achievements: [],
      preferences: {
        dailyGoal: 10, // minutes
        notifications: true,
        soundEffects: true
      }
    };

    users.push(newUser);
    saveCurrentState();

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
        lastLogin: newUser.lastLogin,
        totalLessonsCompleted: newUser.totalLessonsCompleted
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

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

    // Update last login
    user.lastLogin = new Date();
    saveCurrentState();

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
        lastLogin: user.lastLogin,
        totalLessonsCompleted: user.totalLessonsCompleted
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Get user profile (protected)
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    xp: user.xp,
    level: user.level,
    levelTitle: getLevelTitle(user.level),
    streak: user.streak,
    hearts: user.hearts,
    maxHearts: 5,
    lastLogin: user.lastLogin,
    totalLessonsCompleted: user.totalLessonsCompleted,
    achievements: user.achievements,
      preferences: user.preferences,
      xpToNextLevel: calculateXPToNextLevel(user.xp)
  });
});

// Update user progress (after lesson completion)
app.post('/api/progress', authenticateToken, (req, res) => {
  const { xpEarned, lessonCompleted, lessonId } = req.body;
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Validate input
  if (typeof xpEarned !== 'number' || xpEarned < 0) {
    return res.status(400).json({ message: 'Invalid XP amount' });
  }

  // Store old values for level calculation
  const oldXP = user.xp;
  const oldLevel = user.level;

  // Update XP and recalculate level
  user.xp = (user.xp || 0) + xpEarned;
  user.level = calculateLevelFromXP(user.xp);

  // Update streak if lesson completed today
  if (lessonCompleted) {
    const today = new Date().toDateString();
    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;
    
    if (lastLoginDate === today) {
      // Same day, increment streak
      user.streak = (user.streak || 0) + 1;
    } else if (lastLoginDate !== today && lastLoginDate !== null) {
      // Different day but not first login, reset streak to 1
      user.streak = 1;
    } else {
      // First login or no previous login
      user.streak = 1;
    }
    
    // Update lesson tracking
    user.lastLessonCompleted = lessonId;
    user.totalLessonsCompleted = (user.totalLessonsCompleted || 0) + 1;
  }

  // Update last login timestamp
  user.lastLogin = new Date();

  // Check for and award new achievements
  const newAchievements = checkForAchievements(user);
  if (newAchievements.length > 0) {
    // Avoid duplicate achievements
    const existingIds = new Set(user.achievements.map(a => a.id));
    const uniqueNewAchievements = newAchievements.filter(a => !existingIds.has(a.id));
    user.achievements = [...user.achievements, ...uniqueNewAchievements];
  }

  // Hearts logic: regenerate over time or on lesson completion
  if (user.hearts === 0) {
    // If out of hearts, refill on lesson completion (simplified model)
    if (lessonCompleted) {
      user.hearts = 5;
    }
    // In a more sophisticated implementation, we would check time since last refill
  } else if (user.hearts < 5 && lessonCompleted) {
    // Gradually refill hearts (simplified model)
    user.hearts = Math.min(5, user.hearts + 1);
  }

  // Prepare response
  const responseUser = {
    id: user.id,
    xp: user.xp,
    level: user.level,
    levelTitle: getLevelTitle(user.level),
    levelProgress: calculateLevelProgress(user.xp),
    xpToNextLevel: calculateXPToNextLevel(user.xp),
    streak: user.streak,
    hearts: user.hearts,
    maxHearts: 5,
    lastLogin: user.lastLogin,
    totalLessonsCompleted: user.totalLessonsCompleted,
    achievements: user.achievements
  };

  res.json({
    message: 'Progress updated successfully',
    user: responseUser,
    newAchievements: newAchievements.length > 0 ? newAchievements : []
  });
  saveCurrentState();
});

app.post('/api/practice/speech-score', (req, res) => {
  try {
    const { expectedText, transcript, confidence } = req.body;

    if (!expectedText || !transcript) {
      return res.status(400).json({ message: 'Expected text and transcript are required' });
    }

    const result = scoreSpeechAttempt({ expectedText, transcript, confidence });
    res.json(result);
  } catch (error) {
    console.error('Speech scoring error:', error);
    res.status(500).json({ message: 'Error scoring speech attempt' });
  }
});

app.post('/api/practice/handwriting-score', (req, res) => {
  try {
    const { expectedCharacter, strokes, canvasWidth, canvasHeight } = req.body;

    if (!expectedCharacter) {
      return res.status(400).json({ message: 'Expected character is required' });
    }

    const result = scoreHandwritingAttempt({
      expectedCharacter,
      strokes,
      canvasWidth,
      canvasHeight,
    });

    res.json(result);
  } catch (error) {
    console.error('Handwriting scoring error:', error);
    res.status(500).json({ message: 'Error scoring handwriting attempt' });
  }
});

// Helper function to calculate level from XP
function calculateLevelFromXP(xp) {
  if (xp >= 500) return Math.floor((xp - 500) / 100) + 501; // 501+ for 500+ XP
  if (xp >= 200) return Math.floor((xp - 200) / 10) + 101; // 101-200 for 200-500 XP
  if (xp >= 100) return Math.floor((xp - 100) / 5) + 51; // 51-100 for 100-200 XP
  if (xp >= 50) return Math.floor((xp - 50) / 2) + 26; // 26-50 for 50-100 XP
  if (xp >= 25) return Math.floor((xp - 25) / 1) + 11; // 11-25 for 25-50 XP
  return Math.floor(xp / 10) + 1; // 1-10 for 0-25 XP
}

// Helper function to get level title
function getLevelTitle(level) {
  if (level >= 501) return 'Punjab';
  if (level >= 201) return 'Garden';
  if (level >= 101) return 'Orchard';
  if (level >= 51) return 'Tree';
  if (level >= 26) return 'Sapling';
  if (level >= 11) return 'Sprout';
  return 'Seedling';
}

// Helper function to calculate progress within current level (0-1)
function calculateLevelProgress(xp) {
  const level = calculateLevelFromXP(xp);
  const levelStartXP = getLevelStartXP(level);
  const levelEndXP = getLevelStartXP(level + 1);
  const progressInLevel = xp - levelStartXP;
  const levelLength = levelEndXP - levelStartXP;
  return Math.min(1, Math.max(0, progressInLevel / levelLength));
}

// Helper function to get starting XP for a level
function getLevelStartXP(level) {
  if (level >= 501) return 500 + (level - 501) * 100;
  if (level >= 101) return 200 + (level - 101) * 10;
  if (level >= 51) return 100 + (level - 51) * 5;
  if (level >= 26) return 50 + (level - 26) * 2;
  if (level >= 11) return 25 + (level - 11) * 1;
  return (level - 1) * 10;
}

// Helper function to calculate XP needed for next level
function calculateXPToNextLevel(currentXP) {
  const currentLevel = calculateLevelFromXP(currentXP);
  const nextLevelStartXP = getLevelStartXP(currentLevel + 1);
  return Math.max(0, nextLevelStartXP - currentXP);
}

// Helper function to check for and award achievements
function checkForAchievements(user) {
  const newAchievements = [];
  const existingAchievementIds = new Set(user.achievements.map(a => a.id));
  
  // Define achievements
  const achievements = [
    { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🌱', xp: 10 },
    { id: 'streak_3', name: 'On a Roll', description: 'Maintain a 3-day streak', icon: '🔥', xp: 20 },
    { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥🔥', xp: 50 },
    { id: 'streak_30', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '🔥🔥🔥', xp: 200 },
    { id: 'learner_10', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '📚', xp: 50 },
    { id: 'learner_50', name: 'Scholar', description: 'Complete 50 lessons', icon: '📚📚', xp: 200 },
    { id: 'level_10', name: 'Growing Strong', description: 'Reach level 10', icon: '🌳', xp: 100 },
    { id: 'level_50', name: 'Master Learner', description: 'Reach level 50', icon: '🌳🌳', xp: 500 }
  ];

  // Check each achievement
  for (const achievement of achievements) {
    if (!existingAchievementIds.has(achievement.id)) {
      let earned = false;
      
      switch (achievement.id) {
        case 'first_lesson':
          earned = user.totalLessonsCompleted >= 1;
          break;
        case 'streak_3':
          earned = user.streak >= 3;
          break;
        case 'streak_7':
          earned = user.streak >= 7;
          break;
        case 'streak_30':
          earned = user.streak >= 30;
          break;
        case 'learner_10':
          earned = user.totalLessonsCompleted >= 10;
          break;
        case 'learner_50':
          earned = user.totalLessonsCompleted >= 50;
          break;
        case 'level_10':
          earned = user.level >= 10;
          break;
        case 'level_50':
          earned = user.level >= 50;
          break;
      }
      
      if (earned) {
        newAchievements.push({
          ...achievement,
          earnedAt: new Date().toISOString()
        });
      }
    }
  }
  
  return newAchievements;
}

// Get all lessons
app.get('/api/lessons', (req, res) => {
  try {
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Error retrieving lessons' });
  }
});

// Get a specific lesson by ID
app.get('/api/lessons/:id', (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: 'Invalid lesson ID' });
    }
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Error retrieving lesson' });
  }
});

// Get lessons by unit
app.get('/api/units/:unitId/lessons', (req, res) => {
  try {
    const unitId = parseInt(req.params.unitId);
    if (isNaN(unitId)) {
      return res.status(400).json({ message: 'Invalid unit ID' });
    }
    
    const unitLessons = lessons.filter(l => l.unit === unitId);
    res.json(unitLessons);
  } catch (error) {
    console.error('Error fetching unit lessons:', error);
    res.status(500).json({ message: 'Error retrieving unit lessons' });
  }
});

// Get lessons by category
app.get('/api/categories/:category/lessons', (req, res) => {
  try {
    const category = req.params.category;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    const categoryLessons = lessons.filter(l => l.category === category);
    res.json(categoryLessons);
  } catch (error) {
    console.error('Error fetching category lessons:', error);
    res.status(500).json({ message: 'Error retrieving category lessons' });
  }
});

// Get user achievements (protected)
app.get('/api/achievements', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ achievements: user.achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Error retrieving achievements' });
  }
});

// Update user preferences (protected)
app.put('/api/preferences', authenticateToken, (req, res) => {
  try {
    const { dailyGoal, notifications, soundEffects } = req.body;
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update only provided fields
    if (dailyGoal !== undefined) {
      if (typeof dailyGoal !== 'number' || dailyGoal < 1 || dailyGoal > 120) {
        return res.status(400).json({ message: 'Daily goal must be between 1 and 120 minutes' });
      }
      user.preferences.dailyGoal = dailyGoal;
    }
    
    if (notifications !== undefined) {
      if (typeof notifications !== 'boolean') {
        return res.status(400).json({ message: 'Notifications must be a boolean value' });
      }
      user.preferences.notifications = notifications;
    }
    
    if (soundEffects !== undefined) {
      if (typeof soundEffects !== 'boolean') {
        return res.status(400).json({ message: 'Sound effects must be a boolean value' });
      }
      user.preferences.soundEffects = soundEffects;
    }
    
    res.json({ 
      message: 'Preferences updated successfully', 
      preferences: user.preferences 
    });
    saveCurrentState();
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

// Get leaderboard (protected)
app.get('/api/leaderboard', authenticateToken, (req, res) => {
  try {
    // Sort users by XP descending, then by level descending
    const sortedUsers = [...users].sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.level - a.level;
    });
    
    // Return top 10 users with safe data
    const leaderboard = sortedUsers.slice(0, 10).map(user => ({
      id: user.id,
      name: user.name || 'Anonymous',
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      totalLessonsCompleted: user.totalLessonsCompleted
    }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error retrieving leaderboard' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    users: users.length,
    lessons: lessons.length
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'PunjabiLingo API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});