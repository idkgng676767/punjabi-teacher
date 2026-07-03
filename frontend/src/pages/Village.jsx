import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Village = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Building data with unlock requirements
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
      if (token) {
        try {
          const res = await axios.get('/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
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

  if (loading) return <div className="village-page">Loading...</div>;
  if (!userData) return <div className="village-page">Please log in to view your village</div>;

  // Calculate unlocked buildings based on level and XP
  const unlockedBuildings = buildings.filter(building => 
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
        {buildings.map(building => {
          const isUnlocked = userData.level >= building.levelReq || userData.xp >= building.unlockRequirement;
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

function getLevelTitle(level) {
  if (level >= 501) return 'Punjab';
  if (level >= 201) return 'Garden';
  if (level >= 101) return 'Orchard';
  if (level >= 51) return 'Tree';
  if (level >= 26) return 'Sapling';
  if (level >= 11) return 'Sprout';
  return 'Seedling';
}

export default Village;