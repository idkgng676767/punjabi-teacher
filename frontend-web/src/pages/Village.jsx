import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getLevelTitle } from '../utils/progression';
import { getAuthToken } from '../utils/auth';

const Village = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getAuthToken();

  const buildings = [
    { id: 1, name: 'Kothi (Home)', icon: '🏠', unlockRequirement: 0, levelReq: 1, description: 'Your learning home base' },
    { id: 2, name: 'Tandoor', icon: '🔥', unlockRequirement: 50, levelReq: 5, description: 'Food vocabulary hub' },
    { id: 3, name: 'Dhaba', icon: '🍛', unlockRequirement: 100, levelReq: 10, description: 'Restaurant mini-game' },
    { id: 4, name: 'Fields', icon: '🌾', unlockRequirement: 200, levelReq: 15, description: 'Agriculture vocabulary' },
    { id: 5, name: 'Gurdwara', icon: '🪔', unlockRequirement: 300, levelReq: 20, description: 'Spiritual/cultural hub' },
    { id: 6, name: 'School', icon: '📚', unlockRequirement: 400, levelReq: 25, description: 'Advanced grammar lessons' },
    { id: 7, name: 'Market', icon: '🛒', unlockRequirement: 500, levelReq: 30, description: 'Shopping mini-game' },
    { id: 8, name: 'Bhangra Stage', icon: '💃', unlockRequirement: 600, levelReq: 35, description: 'Music & dance hub' },
    { id: 9, name: 'Tractor', icon: '🚜', unlockRequirement: 700, levelReq: 40, description: 'Rural life vocabulary' },
    { id: 10, name: 'Airport', icon: '✈️', unlockRequirement: 1000, levelReq: 50, description: 'Travel & diaspora content' }
  ];

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
        setError(err?.response?.data?.message || 'Unable to load your village.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) return <div className="village-page">Loading...</div>;

  if (!token) {
    return (
      <div className="village-page">
        <div className="profile-card">
          <h1>Sign in required</h1>
          <p>Your village builds from your real progress data.</p>
          <Link to="/auth" className="btn-primary">Sign in</Link>
        </div>
      </div>
    );
  }

  if (error) return <div className="village-page">{error}</div>;
  if (!userData) return <div className="village-page">No village data available.</div>;

  const unlockedBuildings = buildings.filter((building) =>
    userData.level >= building.levelReq || userData.xp >= building.unlockRequirement
  );

  return (
    <div className="village-page">
      <Link to="/" className="btn-back">
        ← Back Home
      </Link>
      <h1>Your Punjabi Village</h1>
      <p>Build your village as you learn Punjabi!</p>

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
          <h3>Streak</h3>
          <p>{userData.streak} days 🔥</p>
        </div>
        <div className="stat">
          <h3>Hearts</h3>
          <p>{userData.hearts}/5 ❤️</p>
        </div>
      </div>

      <div className="village-grid">
        {buildings.map((building) => {
          const isUnlocked = unlockedBuildings.some((item) => item.id === building.id);
          return (
            <div key={building.id} className={`building-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="building-icon">{building.icon}</div>
              <h3>{building.name}</h3>
              <p className="building-description">{building.description}</p>
              {!isUnlocked && (
                <div className="building-lock">
                  <p>Unlock at Level {building.levelReq} or {building.unlockRequirement} XP</p>
                  <p className="progress">
                    {userData.level} / {building.levelReq} Levels
                    <br />
                    {userData.xp} / {building.unlockRequirement} XP
                  </p>
                </div>
              )}
              {isUnlocked && (
                <div className="building-unlocked">
                  <p>✅ Unlocked!</p>
                  <Link to={`/building/${building.id}`} className="btn-building">
                    Enter
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Village;