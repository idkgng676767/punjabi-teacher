export const demoProfile = {
  id: 1,
  email: 'simran@example.com',
  name: 'Simran Kaur',
  xp: 134,
  level: 14,
  levelTitle: 'Tree',
  streak: 9,
  hearts: 4,
  maxHearts: 5,
  totalLessonsCompleted: 12,
  achievements: [
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🌱',
      earnedAt: new Date('2026-06-20').toISOString()
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥🔥',
      earnedAt: new Date('2026-06-30').toISOString()
    }
  ],
  preferences: {
    dailyGoal: 10,
    notifications: true,
    soundEffects: true
  },
  xpToNextLevel: 16
};

export const demoLeaderboard = [
  { id: 1, name: 'Simran Kaur', xp: 134, level: 14, streak: 9, totalLessonsCompleted: 12 },
  { id: 2, name: 'Rajinder Singh', xp: 120, level: 13, streak: 7, totalLessonsCompleted: 10 },
  { id: 3, name: 'Priya Sharma', xp: 108, level: 12, streak: 6, totalLessonsCompleted: 9 },
  { id: 4, name: 'Aman Grewal', xp: 96, level: 11, streak: 5, totalLessonsCompleted: 8 },
  { id: 5, name: 'Thomas Muller', xp: 80, level: 10, streak: 4, totalLessonsCompleted: 7 }
];