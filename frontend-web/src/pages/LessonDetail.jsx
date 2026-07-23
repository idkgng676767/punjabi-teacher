import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getLessonById } from '../data/lessons';
import LessonPlayer from '../components/LessonPlayer';

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(getLessonById(id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/lessons/${id}`);
        if (res.data) {
          setLesson(res.data);
        }
      } catch (err) {
        console.warn('Using local lesson data:', err);
        if (!getLessonById(id)) {
          setError('Failed to load lesson');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleComplete = async (lessonId) => {
    try {
      await axios.post(
        '/api/progress',
        { xpEarned: lesson?.xpReward || 10, lessonCompleted: true, lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  if (loading) return <p className="lesson-detail__status">Loading lesson...</p>;
  if (error) return <p className="lesson-detail__status lesson-detail__status--error">{error}</p>;
  if (!lesson) return <p className="lesson-detail__status">Lesson not found</p>;

  return (
    <div className="lesson-detail">
      <Link to="/lessons" className="btn-back">
        ← Back to Lessons
      </Link>
      <LessonPlayer lesson={lesson} onComplete={handleComplete} />
    </div>
  );
};

export default LessonDetail;