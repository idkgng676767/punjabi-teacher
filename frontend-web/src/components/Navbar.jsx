import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          PunjabiLingo
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/lessons">Learn</Link></li>
          <li><Link to="/practice">Practice</Link></li>
          <li><Link to="/village">Village</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
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