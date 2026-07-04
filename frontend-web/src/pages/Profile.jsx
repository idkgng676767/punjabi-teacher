import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { calculateLevelProgress, getLevelTitle } from '../utils/progression';
import { getAuthToken } from '../utils/auth';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getAuthToken();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) return <div className="profile-page">Loading profile...</div>;

  if (!token) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h1>Sign in required</h1>
          <p>Your profile, streaks, and achievements come from your real account.</p>
          <Link to="/auth" className="btn-primary">Sign in</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="profile-page">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-page">No profile data available.</div>;
  }

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
            <p>{userData.achievements?.length || 0}</p>
          </div>
        </div>
        <div className="level-progress">
          <h3>Level Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${calculateLevelProgress(userData.xp) * 100}%` }}
            />
          </div>
          <p>
            {Math.floor(calculateLevelProgress(userData.xp) * 100)}% to Level {userData.level + 1}
            <br />
            {userData.xpToNextLevel ?? '—'} XP needed
          </p>
        </div>
        {(userData.achievements?.length || 0) > 0 && (
          <div className="achievements">
            <h3>Your Achievements</h3>
            <div className="achievements-grid">
              {userData.achievements.map((achievement) => (
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

export default Profile;