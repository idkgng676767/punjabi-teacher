# PunjabiLingo - Learn Punjabi Language

A comprehensive Punjabi language learning web application built with React (frontend) and Node.js/Express (backend). The app features interactive lessons, practice modes, gamification, and cultural immersion to help users learn Punjabi effectively.

## Features

- **Interactive Lessons**: Learn Gurmukhi script, vocabulary, grammar, and cultural concepts
- **Practice Modes**: Flashcards, listening, speaking, writing, and timed challenges
- **Gamification**: XP points, levels, streaks, hearts (lives), and achievements
- **Village Builder**: Unlock and build your Punjabi village as you learn
- **Skill Tree**: Track your progress across different language skills
- **Leaderboard**: Compete with other learners
- **Offline Support**: Service worker for basic offline functionality
- **Authentication**: Secure user accounts with JWT and bcrypt password hashing
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
punjabi-teacher/
├── backend/                 # Node.js/Express server
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables (not in repo)
├── frontend/                # React/Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, etc.)
│   │   ├── pages/           # Page components (Home, Lessons, Practice, etc.)
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   │   ├── service-worker.js # Offline caching
│   │   └── index.html
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── punjabi_lingo_reminder.sh # Script to remind user after 24 hours
└── .gitignore               # Git ignore file
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following:
   ```
   PORT=5001
   JWT_SECRET=your_secret_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Production Build

To create a production build of the frontend:
```bash
cd frontend
npm run build
```
This will create a `dist` directory with the optimized assets.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Profile & Progress
- `GET /api/profile` - Get user profile (requires auth)
- `POST /api/progress` - Update user progress (requires auth)
- `PUT /api/preferences` - Update user preferences (requires auth)
- `GET /api/achievements` - Get user achievements (requires auth)
- `GET /api/leaderboard` - Get leaderboard (requires auth)

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get a specific lesson
- `GET /api/units/:unitId/lessons` - Get lessons by unit
- `GET /api/categories/:category/lessons` - Get lessons by category

### Health Check
- `GET /api/health` - Check API health

## Features in Detail

### Lessons
The app includes a structured curriculum covering:
- Gurmukhi script (35 letters)
- Vocabulary (numbers, family, food, etc.)
- Grammar (tenses, sentence structure)
- Conversational phrases
- Cultural lessons (Punjabi cuisine, festivals, etc.)

### Practice Modes
1. **Flashcards**: Visual recognition of characters and words
2. **Listening**: Listen to pronunciation and transcribe
3. **Speaking**: Use Web Speech API to practice pronunciation
4. **Writing**: Practice writing Gurmukhi characters
5. **Timed Challenges**: Test your knowledge under time pressure

### Gamification
- **XP System**: Earn points for completing lessons and practice
- **Leveling**: Level up based on XP (with Punjabi-themed titles)
- **Streaks**: Maintain daily learning streaks
- **Hearts**: Lives system that regenerates over time
- **Achievements**: Earn badges for milestones

### Village & Skill Tree
- **Village Builder**: Unlock buildings (home, tandoor, fields, gurdwara, etc.) as you progress
- **Skill Tree**: Track progress in different language branches (foundation, communication, intermediate, advanced, cultural, Shahmukhi)

## Design Philosophy

PunjabiLingo aims to make Punjabi language learning accessible, engaging, and culturally rich. The app incorporates:
- Punjabi cultural elements throughout the UI and content
- Gamified learning to maintain motivation
- Progressive difficulty to accommodate beginners to intermediate learners
- Multimedia approach (visual, auditory, kinesthetic) for different learning styles
- Offline capability for learning on the go

## Future Enhancements

Planned features for future versions:
- Speech-to-text for pronunciation feedback
- Expanded lesson content (more vocabulary, grammar, conversations)
- Social features (friend system, gifting, challenges)
- Mobile app wrapper (Capacitor/React Native)
- Advanced analytics and personalized learning paths
- Integration with Punjabi cultural events and news

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for quality Punjabi language learning resources
- Built with React, Vite, Node.js, and Express
- Uses open-source libraries and resources