import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/leaderboard', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setLeaderboard(res.data);
        } catch (err) {
          console.error('Error fetching leaderboard:', err);
        }
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-page">
      <h1>PunjabiLingo Leaderboard</h1>
      <p>See how you rank against other learners!</p>
      {leaderboard.length === 0 ? (
        <p>No data available yet. Be the first to top the leaderboard!</p>
      ) : (
        <ol className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <li key={user.id} className={`leaderboard-item ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
              <span className="rank">#{index + 1}</span>
              <span className="username">{user.name || 'Anonymous'}</span>
              <span className="xp">{user.xp} XP</span>
              <span className="level">Level {user.level}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;