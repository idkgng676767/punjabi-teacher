import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Practice = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // For simplicity, we'll use the first lesson's letters as flashcards
    // In a real app, we might fetch a set of words or phrases to practice
    const getFlashcards = async () => {
      try {
        const res = await axios.get('/api/lessons/1'); // Get the first lesson (Gurmukhi Basics)
        const lesson = res.data;
        if (lesson.letters) {
          // Convert each letter to a flashcard: show character, ask for transliteration or meaning
          const cards = lesson.letters.map(letter => ({
            id: letter.id,
            prompt: letter.character, // Show the Gurmukhi character
            answer: `${letter.transliteration} - ${letter.exampleMeaning}`, // Transliteration and meaning
            hint: letter.pronunciation, // Pronunciation hint
          }));
          setFlashcards(cards);
        }
      } catch (err) {
        console.error('Error loading practice data:', err);
      }
    };

    getFlashcards();
  }, []);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  if (flashcards.length === 0) {
    return <p>Loading practice data...</p>;
  }

  const card = flashcards[currentIndex];

  return (
    <div className="practice-page">
      <h1>Practice</h1>
      <div className="flashcard">
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h2>{card.prompt}</h2>
            <p>What is the transliteration and meaning?</p>
            <button onClick={handleFlip} className="btn-flip">
              Flip
            </button>
          </div>
          <div className="flashcard-back">
            <h2>{card.answer}</h2>
            <p><em>Pronunciation: {card.hint}</em></p>
            <button onClick={handleFlip} className="btn-flip">
              Back
            </button>
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={handleNext} className="btn-next">
          Next Card
        </button>
        <span>
          Card {currentIndex + 1} of {flashcards.length}
        </span>
      </div>
      <Link to="/lessons" className="btn-back">
        Back to Lessons
      </Link>
    </div>
  );
};

export default Practice;