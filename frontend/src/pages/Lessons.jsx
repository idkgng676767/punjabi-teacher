import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch lessons from the backend
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div className="lessons-page">
      <h1>Learn Punjabi</h1>
      <div className="lessons-grid">
        {lessons.map(lesson => (
          <Link to={`/lesson/${lesson.id}`} key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Lessons;