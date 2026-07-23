import React, { useState } from 'react';
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
  const [playingAudio, setPlayingAudio] = useState(null);

  // Determine which content array the lesson carries
  const items = lesson.letters || lesson.phrases || lesson.numbers || [];

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) onComplete(lesson.id);
  };

  const handleAudio = (itemId) => {
    // Placeholder — real audio playback will be wired later
    setPlayingAudio(itemId);
    setTimeout(() => setPlayingAudio(null), 1500);
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
          className={`lp-item__audio ${playingAudio === (item.id || item.punjabi) ? 'lp-item__audio--active' : ''}`}
          onClick={() => handleAudio(item.id || item.punjabi)}
          aria-label={`Play pronunciation for ${isLetter ? item.character : item.punjabi}`}
          title="Play pronunciation"
        >
          {playingAudio === (item.id || item.punjabi) ? '🔊' : '🔈'}
        </button>
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