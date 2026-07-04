import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { lessons as localLessons } from '../data/lessons';

const Lessons = () => {
  const [lessons, setLessons] = useState(localLessons);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) {
          return;
        }

        const body = await response.text();
        if (!body) {
          return;
        }

        const data = JSON.parse(body);
        if (Array.isArray(data) && data.length > 0) {
          setLessons(data);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div className="page-shell lessons-page">
      <div className="page-header">
        <p className="eyebrow">Lessons</p>
        <h1>Pick up where you left off.</h1>
        <p className="lead">Each lesson is short, focused, and tied to the backend lesson catalog.</p>
      </div>

      <div className="lessons-grid">
        {lessons.map(lesson => (
          <Link to={`/lesson/${lesson.id}`} key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <span className="lesson-meta">Unit {lesson.unit} · {lesson.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Lessons;