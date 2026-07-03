import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/profile', {
            headers: { Authorization: 'Bearer ' + token }
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

  if (loading) return <div>Loading profile...</div>;
  if (!userData) return <div>Please log in to view your profile</div>;

  return (
    <div className="profile-page">
      <Link to="/" className="btn-back">
        ← Back Home
      </Link>
      <h1>Your Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
          <h2>{userData.name || 'Anonymous'}</h2>
          <p className="email">{userData.email}</p>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <h3>Level</h3>
            <p>{userData.level} ({getLevelTitle(userData.level)})</p>
          </div>
          <div className="stat">
            <h3>Experience Points</h3>
            <p>{userData.xp} XP</p>
          </div>
          <div className="stat">
            <h3>Streak</h3>
            <p>{userData.streak} days 🔥</p>
          </div>
          <div className="stat">
            <h3>Hearts</h3>
            <p>{userData.hearts}/5 ❤️</p>
          </div>
          <div className="stat">
            <h3>Lessons Completed</h3>
            <p>{userData.totalLessonsCompleted}</p>
          </div>
          <div className="stat">
            <h3>Achievements</h3>
            <p>{userData.achievements.length}</p>
          </div>
        </div>
        <div className="level-progress">
          <h3>Level Progress</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateLevelProgress(userData.xp) * 100}%` }}
            ></div>
          </div>
          <p>
            {Math.floor(calculateLevelProgress(userData.xp) * 100)}% to Level {userData.level + 1}
            <br />
            {userData.xpToNextLevel} XP needed
          </p>
        </div>
        {userData.achievements.length > 0 && (
          <div className="achievements">
            <h3>Your Achievements</h3>
            <div className="achievements-grid">
              {userData.achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                    <small>Earned: {new Date(achievement.earnedAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

// Helper function to calculate level from XP
function calculateLevelFromXP(xp) {
  if (xp >= 500) return Math.floor((xp - 500) / 100) + 501; // 501+ for 500+ XP
  if (xp >= 200) return Math.floor((xp - 200) / 10) + 101; // 101-200 for 200-500 XP
  if (xp >= 100) return Math.floor((xp - 100) / 5) + 51; // 51-100 for 100-200 XP
  if (xp >= 50) return Math.floor((xp - 50) / 2) + 26; // 26-50 for 50-100 XP
  if (xp >= 25) return Math.floor((xp - 25) / 1) + 11; // 11-25 for 25-50 XP
  return Math.floor(xp / 10) + 1; // 1-10 for 0-25 XP
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

export default Profile;