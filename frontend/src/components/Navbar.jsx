import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;