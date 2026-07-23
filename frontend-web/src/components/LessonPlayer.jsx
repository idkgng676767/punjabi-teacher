import React, { useState, useRef } from 'react';
import './LessonPlayer.css';

/**
 * LessonPlayer — A card-based lesson viewer for the Punjabi language learning app.
 *
 * Props:
 *   lesson: {
 *     id, title, description, category, xpReward,
 *     letters?: [{ id, title, character, pronunciation }],
 *     phrases?: [{ id, punjabi, transliteration, english, pronunciationTip }],
 *     numbers?: [{ punjabi, transliteration, english, pronunciation }]
 *   }
 *   onComplete: (lessonId) => void   — callback when "Mark Complete" is clicked
 */
const LessonPlayer = ({ lesson, onComplete }) => {
  const [completed, setCompleted] = useState(false);
  const [recordingItemId, setRecordingItemId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [scores, setScores] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Determine which content array the lesson carries
  const items = lesson.letters || lesson.phrases || lesson.numbers || [];

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) onComplete(lesson.id);
  };

  const handleAudio = async (itemId) => {
    if (!isRecording && recordingItemId !== itemId) {
      // START RECORDING
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('audio', audioBlob);

          try {
            const response = await fetch('/api/speech/score', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            setScores(prev => ({
              ...prev,
              [itemId]: Math.round(data.score || 0),
            }));
          } catch (error) {
            console.error('Upload failed:', error);
            setScores(prev => ({
              ...prev,
              [itemId]: 0,
            }));
          }

          setIsRecording(false);
          setRecordingItemId(null);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setRecordingItemId(itemId);
        setIsRecording(true);
      } catch (error) {
        console.error('Microphone access denied:', error);
        alert('Please allow microphone access to record');
      }
    } else if (isRecording && recordingItemId === itemId) {
      // STOP RECORDING
      mediaRecorderRef.current?.stop();
    }
  };

  // ── Render helpers ──────────────────────────────────────────────

  const renderItem = (item) => {
    const isLetter = lesson.letters != null;
    const isPhrase = lesson.phrases != null;
    const isNumber = lesson.numbers != null;

    return (
      <div key={item.id || item.punjabi} className="lp-item">
        {/* Character / Punjabi text */}
        <span className="lp-item__char">
          {isLetter ? item.character : item.punjabi}
        </span>

        {/* Title / transliteration */}
        <span className="lp-item__title">
          {isLetter ? item.title : item.transliteration}
        </span>

        {/* Pronunciation tip */}
        <span className="lp-item__pronunciation">
          {isLetter
            ? item.pronunciation
            : isPhrase
              ? item.pronunciationTip
              : item.pronunciation}
        </span>

        {/* Audio button */}
        <button
          className={`lp-item__audio ${isRecording && recordingItemId === (item.id || item.punjabi) ? 'lp-item__audio--recording' : ''}`}
          onClick={() => handleAudio(item.id || item.punjabi)}
          aria-label={`Record pronunciation for ${isLetter ? item.character : item.punjabi}`}
          title={isRecording && recordingItemId === (item.id || item.punjabi) ? 'Stop recording' : 'Start recording'}
        >
          {isRecording && recordingItemId === (item.id || item.punjabi) ? '🔴' : '🔈'}
        </button>

        {/* Score display */}
        {scores[item.id || item.punjabi] !== undefined && (
          <div className="lp-item__score">
            Score: {scores[item.id || item.punjabi]}/100
          </div>
        )}
      </div>
    );
  };

  // ── Main render ─────────────────────────────────────────────────

  return (
    <div className="lp-card">
      {/* XP Badge */}
      <span className="lp-xp">+{lesson.xpReward} XP</span>

      {/* Header */}
      <div className="lp-header">
        <span className="lp-category">{lesson.category}</span>
        <h2 className="lp-title">{lesson.title}</h2>
        <p className="lp-description">{lesson.description}</p>
      </div>

      {/* Content grid */}
      <div className="lp-grid">
        {items.map(renderItem)}
      </div>

      {/* Footer */}
      <div className="lp-footer">
        {completed ? (
          <div className="lp-completed">
            <span className="lp-completed__icon">✅</span>
            <span className="lp-completed__text">Lesson Complete!</span>
          </div>
        ) : (
          <button
            className="lp-complete-btn"
            onClick={handleComplete}
            disabled={items.length === 0}
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;