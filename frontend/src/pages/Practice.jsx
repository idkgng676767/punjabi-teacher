import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Practice = () => {
  const [practiceMode, setPracticeMode] = useState('flashcards'); // flashcards, listening, speaking, writing, timed
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const token = localStorage.getItem('token');
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [writingInput, setWritingInput] = useState('');
  const [correctWriting, setCorrectWriting] = useState(false);

  useEffect(() => {
    // Load practice data based on mode
    const loadPracticeData = async () => {
      try {
        // For simplicity, we'll use the first lesson's content
        const res = await axios.get('/api/lessons/1'); // Get the first lesson (Gurmukhi Basics)
        const lesson = res.data;
        
        if (practiceMode === 'flashcards' && lesson.letters) {
          // Convert each letter to a flashcard: show character, ask for transliteration or meaning
          const cards = lesson.letters.map(letter => ({
            id: letter.id,
            prompt: letter.character, // Show the Gurmukhi character
            answer: `${letter.transliteration} - ${letter.exampleMeaning}`, // Transliteration and meaning
            hint: letter.pronunciation, // Pronunciation hint
          }));
          setFlashcards(cards);
        } else if (practiceMode === 'listening' && lesson.letters) {
          // For listening practice, we'll use the letters with audio
          const listeningItems = lesson.letters.map(letter => ({
            id: letter.id,
            character: letter.character,
            correctAnswer: letter.transliteration,
            audioUrl: letter.audioUrl,
            meaning: letter.exampleMeaning
          }));
          setWords(listeningItems);
          setCurrentWord(listeningItems[0]);
        } else if (practiceMode === 'speaking' && lesson.letters) {
          // For speaking practice, we'll use the letters
          const speakingItems = lesson.letters.map(letter => ({
            id: letter.id,
            character: letter.character,
            correctAnswer: letter.transliteration,
            audioUrl: letter.audioUrl,
            meaning: letter.exampleMeaning
          }));
          setWords(speakingItems);
          setCurrentWord(speakingItems[0]);
        } else if (practiceMode === 'writing' && lesson.letters) {
          // For writing practice, we'll use the letters
          const writingItems = lesson.letters.map(letter => ({
            id: letter.id,
            character: letter.character,
            correctAnswer: letter.character, // They need to write the character
            meaning: letter.exampleMeaning,
            transliteration: letter.transliteration
          }));
          setWords(writingItems);
          setCurrentWord(writingItems[0]);
        } else if (practiceMode === 'timed' && lesson.letters) {
          // For timed challenge, we'll use the letters
          const timedItems = lesson.letters.map(letter => ({
            id: letter.id,
            character: letter.character,
            correctAnswer: `${letter.transliteration} - ${letter.exampleMeaning}`,
            meaning: letter.exampleMeaning
          }));
          setFlashcards(timedItems);
          setTimer(60); // 60 seconds for timed challenge
        }
      } catch (err) {
        console.error('Error loading practice data:', err);
      }
    };

    loadPracticeData();
  }, [practiceMode]);

  // Timer effect for timed challenge
  useEffect(() => {
    let timerInterval = null;
    if (timerActive && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setShowResults(true);
      // Calculate score for timed challenge
      setScore(currentIndex); // In timed mode, currentIndex is the number of correct answers
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerActive, timer, currentIndex]);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    if (practiceMode === 'timed' && !timerActive) {
      // Start timer when first next is clicked in timed mode
      setTimerActive(true);
    }

    if (practiceMode === 'timed') {
      // In timed mode, we only increment if the answer was correct
      // For simplicity, we'll assume they got it right if they moved on
      setCurrentIndex(prev => prev + 1);
      if (currentIndex >= flashcards.length - 1) {
        // End of cards, reset to beginning
        setCurrentIndex(0);
      }
    } else {
      // For other modes, just move to next item
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      setShowAnswer(false);

      // Reset writing input for writing mode
      if (practiceMode === 'writing') {
        setWritingInput('');
        setCorrectWriting(false);
      }
    }
  };

  const handleListening = () => {
    setIsListening(true);
    // Play audio for current word
    if (currentWord && currentWord.audioUrl) {
      const audio = new Audio(currentWord.audioUrl);
      audio.play().catch(e => console.log('Audio play failed:', e));
    }

    // Auto-stop listening after audio plays
    setTimeout(() => {
      setIsListening(false);
    }, 3000); // Assume 3 seconds max for audio
  };

  const handleSpeaking = async () => {
    setIsRecording(true);
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Play back the recording so user can hear themselves
        audio.play().then(() => {
          // In a real app, we'd send this to speech-to-text API
          // For now, we'll simulate a transcription attempt
          setTranscript("ਅ"); // Simulated transcription
          setIsRecording(false);

          // Clean up
          stream.getTracks().forEach(track => track.stop());
          URL.revokeObjectURL(audioUrl);
        });
      });

      mediaRecorder.start();

      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const handleWritingCheck = (currentWord) => {
    return writingInput === currentWord.character;
  };

  const handleWritingChange = (e) => {
    setWritingInput(e.target.value);
    // Check if input matches the expected character (simplified)
    setCorrectWriting(e.target.value === currentWord.character);
  };

  const handleWritingSubmit = () => {
    if (correctWriting) {
      // Correct answer, move to next
      setCurrentIndex(prev => (prev + 1) % words.length);
      setWritingInput('');
      setCorrectWriting(false);
    } else {
      // Incorrect, show error or hint
      alert('Try again! Remember how to write this character.');
    }
  };

  if (practiceMode === 'flashcards') {
    if (flashcards.length === 0) {
      return <p>Loading practice data...</p>;
    }

    const card = flashcards[currentIndex];

    return (
      <div className="practice-page">
        <h1>Flashcard Practice</h1>
        <div className="mode-selector">
          <button 
            className={practiceMode === 'flashcards' ? 'active' : ''}
            onClick={() => setPracticeMode('flashcards')}
          >
            Flashcards
          </button>
          <button 
            className={practiceMode === 'listening' ? 'active' : ''}
            onClick={() => setPracticeMode('listening')}
          >
            Listening
          </button>
          <button 
            className={practiceMode === 'speaking' ? 'active' : ''}
            onClick={() => setPracticeMode('speaking')}
          >
            Speaking
          </button>
          <button 
            className={practiceMode === 'writing' ? 'active' : ''}
            onClick={() => setPracticeMode('writing')}
          >
            Writing
          </button>
          <button 
            className={practiceMode === 'timed' ? 'active' : ''}
            onClick={() => setPracticeMode('timed')}
          >
            Timed Challenge
          </button>
        </div>

        {practiceMode === 'timed' && timerActive && (
          <div className="timer">
            Time left: {timer} seconds
          </div>
        )}

        {practiceMode === 'timed' && showResults && (
          <div className="results">
            <h2>Time's up!</h2>
            <p>You scored {score} points</p>
            <Link to="/lessons" className="btn-back">
              Back to Lessons
            </Link>
          </div>
        )}

        {!showResults && (
          <>
            <div className="practice-content">
              {practiceMode === 'listening' && (
                <>
                  <h2>Listen and Translate</h2>
                  <div className="listening-card">
                    <div className="listen-prompt">
                      Listen to the audio and type the transliteration:
                    </div>
                    {currentWord && (
                      <>
                        <button 
                          className={`listen-btn ${isListening ? 'listening' : ''}`}
                          onClick={handleListening}
                          disabled={isListening}
                        >
                          {isListening ? 'Listening...' : '🔊 Play Audio'}
                        </button>
                        <div className="audio-info">
                          <p>Character: {currentWord.character}</p>
                          <p>Meaning: {currentWord.meaning}</p>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Type transliteration here..."
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                        />
                        <button 
                          onClick={() => {
                            if (transcript.toLowerCase() === currentWord.correctAnswer.toLowerCase()) {
                              setScore(prev => prev + 1);
                              setCurrentIndex(prev => (prev + 1) % words.length);
                              setTranscript('');
                            } else {
                              alert('Try again!');
                            }
                          }}
                        >
                          Check Answer
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
              {practiceMode === 'speaking' && (
                <>
                  <h2>Speak and Practice</h2>
                  <div className="speaking-card">
                    <div className="speak-prompt">
                      Press the button, say the character clearly, then listen to your pronunciation:
                    </div>
                    {currentWord && (
                      <>
                        <div className="word-to-speak">
                          <h3>{currentWord.character}</h3>
                          <p>({currentWord.transliteration})</p>
                        </div>
                        <button 
                          className={`speak-btn ${isRecording ? 'recording' : ''}`}
                          onClick={handleSpeaking}
                          disabled={isRecording}
                        >
                          {isRecording ? 'Recording...' : '🎤 Speak'}
                        </button>
                        {transcript && (
                          <div className="transcript-result">
                            <p>You said: <strong>{transcript}</strong></p>
                            <p>Correct: <strong>{currentWord.correctAnswer}</strong></p>
                            {transcript.toLowerCase() === currentWord.correctAnswer.toLowerCase() && (
                              <p>✅ Correct!</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              {practiceMode === 'writing' && (
                <>
                  <h2>Writing Practice</h2>
                  <div className="writing-card">
                    <div className="write-prompt">
                      Write the following character:
                    </div>
                    {currentWord && (
                      <>
                        <div className="character-to-write">
                          <h2>{currentWord.character}</h2>
                          <p>Transliteration: {currentWord.transliteration}</p>
                          <p>Meaning: {currentWord.meaning}</p>
                        </div>
                        <div className="writing-input-area">
                          <input 
                            type="text" 
                            placeholder="Write the Gurmukhi character here..."
                            value={writingInput}
                            onChange={handleWritingChange}
                            className={correctWriting ? 'correct' : 'incorrect'}
                          />
                          <button 
                            onClick={handleWritingSubmit}
                            disabled={writingInput.trim() === ''}
                          >
                            Check Writing
                          </button>
                        </div>
                        {!correctWriting && writingInput.trim() !== '' && (
                          <p className="hint">Try again! Pay attention to the shape and strokes.</p>
                        )}
                        {correctWriting && (
                          <p className="success">✅ Correct! Great job!</p>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              {!['listening', 'speaking', 'writing'].includes(practiceMode) && (
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
              )}
            </div>

            <div className="controls">
              {practiceMode === 'listening' && (
                <>
                  <button onClick={handleNext} className="btn-next">
                    Next Word
                  </button>
                  <span>
                    Word {currentIndex + 1} of {words.length}
                  </span>
                </>
              )}
              {practiceMode === 'speaking' && (
                <>
                  <button onClick={handleNext} className="btn-next">
                    Next Word
                  </button>
                  <span>
                    Word {currentIndex + 1} of {words.length}
                  </span>
                </>
              )}
              {practiceMode === 'writing' && (
                <>
                  <button onClick={handleNext} className="btn-next">
                    Next Word
                  </button>
                  <span>
                    Word {currentIndex + 1} of {words.length}
                  </span>
                </>
              )}
              {!['listening', 'speaking', 'writing'].includes(practiceMode) && (
                <>
                  <button onClick={handleNext} className="btn-next">
                    Next Card
                  </button>
                  <span>
                    Card {currentIndex + 1} of {flashcards.length}
                  </span>
                </>
              )}
              <Link to="/lessons" className="btn-back">
                Back to Lessons
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return null; // This shouldn't happen
};

export default Practice;