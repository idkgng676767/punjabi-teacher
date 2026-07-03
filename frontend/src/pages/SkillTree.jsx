import React from 'react';
import { Link } from 'react-router-dom';

const SkillTree = () => {
  const skills = [
    { id: 1, name: 'Hello', description: 'Basic greetings and introductions', unlocked: true },
    { id: 2, name: 'Food', description: 'Food vocabulary and dining', unlocked: true },
    { id: 3, name: 'Family', description: 'Family terms and relationships', unlocked: true },
    { id: 4, name: 'Travel', description: 'Directions and travel phrases', unlocked: false },
    { id: 5, name: 'Work', description: 'Workplace and professions', unlocked: false },
    { id: 6, name: 'Music', description: 'Music and dance vocabulary', unlocked: false },
    { id: 7, name: 'Wedding', description: 'Wedding traditions and phrases', unlocked: false },
    { id: 8, name: 'Gurbani', description: 'Introduction to Gurbani', unlocked: false },
  ];

  return (
    <div className="skill-tree-page">
      <h1>Skill Tree</h1>
      <p>Unlock new skills as you learn!</p>
      <div className="skill-grid">
        {skills.map(skill => (
          <div key={skill.id} className={`skill-card ${skill.unlocked ? 'unlocked' : 'locked'}`}>
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
            {!skill.unlocked && <p className="lock-icon">🔒</p>}
            <Link to={`/lesson/${skill.id}`} className="btn-skill">
              Start
            </Link>
          </div>
        ))}
      </div>
      <Link to="/" className="btn-back">
        Back Home
      </Link>
    </div>
  );
};

export default SkillTree;