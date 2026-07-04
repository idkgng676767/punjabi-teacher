import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { clearAuthToken, getAuthToken } from '../utils/auth';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const token = getAuthToken();
  const links = [
    ['Overview', '/'],
    ['Learn', '/lessons'],
    ['Practice', '/practice'],
    ['Skill Tree', '/skill-tree'],
    ['Village', '/village'],
    ['Leaderboard', '/leaderboard'],
    ['Profile', '/profile']
  ];

  const handleSignOut = () => {
    clearAuthToken();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          PunjabiLingo
        </Link>
        <ul className="navbar-menu">
          {links.map(([label, to]) => (
            <li key={label}><Link to={to}>{label}</Link></li>
          ))}
          <li>
            {token ? (
              <button onClick={handleSignOut} className="btn-icon theme-toggle auth-toggle" aria-label="Sign out">
                ⎋
              </button>
            ) : (
              <Link to="/auth" className="btn-icon theme-toggle auth-toggle" aria-label="Sign in">
                ↗
              </Link>
            )}
          </li>
          <li>
            <button 
              onClick={toggleTheme} 
              className="btn-icon theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;