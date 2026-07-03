import React from 'react';
import { Link } from 'react-router-dom';

const Village = () => {
  return (
    <div className="village-page">
      <h1>Your Punjabi Village</h1>
      <p>Build your village as you learn!</p>
      <div className="village-preview">
        <div className="building">
          <h3>Kothi (Home)</h3>
          <p>Level 1</p>
        </div>
        <div className="building locked">
          <h3>Tandoor</h3>
          <p>Unlock at 50 coins</p>
        </div>
        <div className="building locked">
          <h3>Dhaba</h3>
          <p>Unlock at 100 coins</p>
        </div>
        <div className="building locked">
          <h3>Fields</h3>
          <p>Unlock at 200 coins</p>
        </div>
        <div className="building locked">
          <h3>Gurdwara</h3>
          <p>Unlock at 300 coins</p>
        </div>
        <div className="building locked">
          <h3>School</h3>
          <p>Unlock at 400 coins</p>
        </div>
        <div className="building locked">
          <h3>Market</h3>
          <p>Unlock at 500 coins</p>
        </div>
        <div className="building locked">
          <h3>Bhangra Stage</h3>
          <p>Unlock at 600 coins</p>
        </div>
        <div className="building locked">
          <h3>Tractor</h3>
          <p>Unlock at 700 coins</p>
        </div>
        <div className="building locked">
          <h3>Airport</h3>
          <p>Unlock at 1000 coins</p>
        </div>
      </div>
      <Link to="/" className="btn-back">
        Back Home
      </Link>
    </div>
  );
};

export default Village;