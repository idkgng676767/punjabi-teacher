import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getAuthToken();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res.data)) {
          setLeaderboard(res.data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) return <div>Loading leaderboard...</div>;

  if (!token) {
    return (
      <div className="leaderboard-page">
        <div className="profile-card">
          <h1>Sign in required</h1>
          <p>The leaderboard comes from live learner accounts.</p>
          <Link to="/auth" className="btn-primary">Sign in</Link>
        </div>
      </div>
    );
  }

  if (error) return <div className="leaderboard-page">{error}</div>;

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