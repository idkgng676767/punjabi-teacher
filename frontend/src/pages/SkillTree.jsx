import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SkillTree = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Define skill tree structure based on the plan
  const skillTree = {
    foundation: {
      title: 'Foundation Branch',
      color: '#FF9933', // Saffron
      skills: [
        { id: 'gurmukhi-alphabet', name: 'Gurmukhi Alphabet', description: 'Learn all 35 Gurmukhi letters', icon: '🔤', requiredLevel: 1, requiredLessons: 1 },
        { id: 'basic-pronunciation', name: 'Basic Pronunciation', description: 'Master tones and basic sounds', icon: '🔊', requiredLevel: 5, requiredLessons: 3 },
        { id: 'numbers-counting', name: 'Numbers & Counting', description: 'Learn to count and use numbers', icon: '🔢', requiredLevel: 3, requiredLessons: 2 }
      ]
    },
    communication: {
      title: 'Communication Branch',
      color: '#138808', // Emerald
      skills: [
        { id: 'greetings', name: 'Greetings & Introductions', description: 'Learn basic greetings and self-introduction', icon: '👋', requiredLevel: 2, requiredLessons: 2 },
        { id: 'family', name: 'Family & Relationships', description: 'Learn family terms and relationships', icon: '👨‍👩‍👧‍👦', requiredLevel: 4, requiredLessons: 4 },
        { id: 'food', name: 'Food & Dining', description: 'Learn food vocabulary and dining phrases', icon: '🍽️', requiredLevel: 3, requiredLessons: 3 },
        { id: 'daily-routine', name: 'Daily Routine', description: 'Learn time expressions and daily activities', icon: '⏰', requiredLevel: 6, requiredLessons: 5 },
        { id: 'shopping', name: 'Shopping & Money', description: 'Learn shopping vocabulary and bargaining', icon: '🛍️', requiredLevel: 7, requiredLessons: 6 },
        { id: 'directions', name: 'Directions & Travel', description: 'Learn to ask for directions and travel phrases', icon: '🧭', requiredLevel: 8, requiredLessons: 7 }
      ]
    },
    intermediate: {
      title: 'Intermediate Branch',
      color: '#000080', // Royal Blue
      skills: [
        { id: 'tenses', name: 'Past, Present, Future Tenses', description: 'Master verb tenses in Punjabi', icon: '⏳', requiredLevel: 10, requiredLessons: 8 },
        { id: 'adjectives', name: 'Adjectives & Descriptions', description: 'Learn to describe people and things', icon: '📝', requiredLevel: 12, requiredLessons: 10 },
        { id: 'emotions', name: 'Emotions & Feelings', description: 'Express emotions and feelings', icon: '💭', requiredLevel: 11, requiredLessons: 9 },
        { id: 'weather', name: 'Weather & Seasons', description: 'Talk about weather and seasons', icon: '🌦️', requiredLevel: 9, requiredLessons: 7 },
        { id: 'health', name: 'Health & Body', description: 'Learn body parts and health vocabulary', icon: '🏥', requiredLevel: 13, requiredLessons: 11 },
        { id: 'work', name: 'Work & Profession', description: 'Learn job titles and workplace phrases', icon: '💼', requiredLevel: 14, requiredLessons: 12 }
      ]
    },
    advanced: {
      title: 'Advanced Branch',
      color: '#800080', // Purple (not in original but we need a color)
      skills: [
        { id: 'formal-speech', name: 'Formal vs Informal Speech', description: 'Learn formal and informal registers', icon: '🤝', requiredLevel: 16, requiredLessons: 14 },
        { id: 'idioms', name: 'Idioms & Proverbs', description: 'Learn common idioms and proverbs', icon: '💬', requiredLevel: 18, requiredLessons: 16 },
        { id: 'literature', name: 'Punjabi Literature Basics', description: 'Introduction to Punjabi literature', icon: '📖', requiredLevel: 20, requiredLessons: 18 },
        { id: 'news', name: 'News & Media', description: 'Learn news vocabulary and media phrases', icon: '📰', requiredLevel: 17, requiredLessons: 15 },
        { id: 'business', name: 'Business Punjabi', description: 'Learn business vocabulary and phrases', icon: '💼', requiredLevel: 19, requiredLessons: 17 },
        { id: 'academic', name: 'Academic Punjabi', description: 'Learn academic and formal writing', icon: '🎓', requiredLevel: 22, requiredLessons: 20 }
      ]
    },
    cultural: {
      title: 'Cultural Branch',
      color: '#FF9933', // Saffron again or we can use a different shade
      skills: [
        { id: 'sikh-history', name: 'Sikh History & Gurbani', description: 'Learn Sikh history and Gurbani basics', icon: '🪔', requiredLevel: 25, requiredLessons: 22 },
        { id: 'music-poetry', name: 'Punjabi Music & Poetry', description: 'Explore Punjabi music and poetry', icon: '🎵', requiredLevel: 23, requiredLessons: 20 },
        { id: 'festivals', name: 'Festivals & Celebrations', description: 'Learn about Punjabi festivals', icon: '🎉', requiredLevel: 21, requiredLessons: 19 },
        { id: 'agriculture', name: 'Agriculture & Rural Life', description: 'Learn about farming and rural life', icon: '🌾', requiredLevel: 24, requiredLessons: 21 },
        { id: 'wedding', name: 'Wedding Traditions', description: 'Learn about Punjabi wedding traditions', icon: '💒', requiredLevel: 26, requiredLessons: 23 },
        { id: 'diaspora', name: 'Diaspora Experience', description: 'Learn about Punjabi diaspora life', icon: '🌍', requiredLevel: 27, requiredLessons: 24 }
      ]
    },
    shahmukhi: {
      title: 'Shahmukhi Branch (Parallel)',
      color: '#008080', // Teal
      skills: [
        { id: 'shahmukhi-alphabet', name: 'Shahmukhi Alphabet', description: 'Learn the Shahmukhi script', icon: '🔤', requiredLevel: 30, requiredLessons: 25 },
        { id: 'gurmukhi-to-shmukhi', name: 'Gurmukhi to Shahmukhi Bridge', description: 'Learn to convert between scripts', icon: '🔄', requiredLevel: 32, requiredLessons: 28 },
        { id: 'pakistani-variants', name: 'Pakistani Punjabi Variants', description: 'Learn regional variants in Pakistan', icon: '🇵🇰', requiredLevel: 34, requiredLessons: 30 },
        { id: 'urdu-loanwords', name: 'Urdu Loanwords', description: 'Learn Urdu loanwords in Punjabi', icon: '🕌', requiredLevel: 36, requiredLessons: 32 }
      ]
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/profile', {
            headers: { Authorization: *** ${token}` }
          });
          setUserData(res.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) return <div className="skill-tree-page">Loading...</div>;
  if (!userData) return <div className="skill-tree-page">Please log in to view your skill tree</div>;

  // Determine if a skill is unlocked based on user data
  const isSkillUnlocked = (skill) => {
    return userData.level >= skill.requiredLevel && 
           userData.totalLessonsCompleted >= skill.requiredLessons;
  };

  return (
    <div className="skill-tree-page">
      <Link to="/" className="btn-back">
        ← Back Home
      </Link>
      <h1>Skill Tree</h1>
      <p>Unlock new skills as you learn Punjabi!</p>
      
      <div className="user-stats">
        <div className="stat">
          <h3>Level</h3>
          <p>{userData.level} ({getLevelTitle(userData.level)})</p>
        </div>
        <div className="stat">
          <h3>XP</h3>
          <p>{userData.xp}</p>
        </div>
        <div className="stat">
          <h3>Lessons Completed</h3>
          <p>{userData.totalLessonsCompleted}</p>
        </div>
      </div>

      <div className="skill-tree-container">
        {Object.entries(skillTree).map(([branchKey, branch]) => (
          <div key={branchKey} className="skill-branch">
            <h2 style={{ color: branch.color }}>{branch.title}</h2>
            <div className="skills-grid">
              {branch.skills.map(skill => {
                const unlocked = isSkillUnlocked(skill);
                return (
                  <div key={skill.id} className={`skill-card ${unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="skill-icon">{skill.icon}</div>
                    <h3>{skill.name}</h3>
                    <p className="skill-description">{skill.description}</p>
                    {!unlocked && (
                      <div className="skill-lock">
                        <p>Requires Level {skill.requiredLevel} and {skill.requiredLessons} lessons completed</p>
                        <p className="progress">
                          {userData.level} / {skill.requiredLevel} Levels<br />
                          {userData.totalLessonsCompleted} / {skill.requiredLessons} Lessons
                        </p>
                      </div>
                    )}
                    {unlocked && (
                      <div className="skill-unlocked">
                        <p>✅ Unlocked!</p>
                        <Link to={`/lesson/${skill.id}`} className="btn-skill">
                          Start Learning
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getLevelTitle(level) {
  if (level >= 501) return 'Punjab';
  if (level >= 201) return 'Garden';
  if (level >= 101) return 'Orchard';
  if (level >= 51) return 'Tree';
  if (level >= 26) return 'Sapling';
  if (level >= 11) return 'Sprout';
  return 'Seedling';
}

export default SkillTree;