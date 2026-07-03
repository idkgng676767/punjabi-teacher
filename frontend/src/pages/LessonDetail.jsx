import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lessons/${id}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lesson:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  // If it's a unit with letters, we might want to show the first letter or a list
  // For simplicity, we'll just display the lesson title and description, and if it has letters, list them.
  return (
    <div className="lesson-detail">
      <Link to="/lessons" className="btn-back">
        ← Back to Lessons
      </Link>
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      {lesson.letters && lesson.letters.length > 0 && (
        <div className="letters-list">
          <h2>Letters in this unit:</h2>
          <div className="letters-grid">
            {lesson.letters.map(letter => (
              <div key={letter.id} className="letter-card">
                <div className="letter-character">{letter.character}</div>
                <div className="letter-transliteration">{letter.transliteration}</div>
                <div className="letter-pronunciation">{letter.pronunciation}</div>
                <div className="letter-example">
                  <strong>{letter.exampleWord}</strong> ({letter.exampleMeaning})
                </div>
                {/* In a real app, we might have an audio button here */}
                <button className="btn-audio">Play Audio</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetail;