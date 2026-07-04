import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getLessonById } from '../data/lessons';
import { getAuthToken } from '../utils/auth';

const modeCards = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Instant recall for script, words, and transliteration.',
    accent: 'Flip, review, and lock in recognition.'
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Audio-first prompts that train comprehension.',
    accent: 'Listen, identify, and type the answer.'
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Pronunciation practice with tone awareness.',
    accent: 'Record, compare, and score pronunciation.'
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Character formation, stroke ordering, and recall.',
    accent: 'Trace, write, and verify the shape.'
  },
  {
    id: 'timed',
    title: 'Timed Challenge',
    description: 'Speed rounds for accuracy under pressure.',
    accent: 'Race the clock and review mistakes.'
  }
];

const defaultDeck = [
  { punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', transliteration: 'Sat Sri Akal', english: 'Hello / goodbye' },
  { punjabi: 'ਪਾਣੀ', transliteration: 'Paani', english: 'Water' },
  { punjabi: 'ਘਰ', transliteration: 'Ghar', english: 'Home' },
  { punjabi: 'ਦੋਸਤ', transliteration: 'Dost', english: 'Friend' }
];

const SPEECH_PASS_SCORE = 82;
const HANDWRITING_PASS_SCORE = 78;

function getAttemptXP(scoreValue) {
  return Math.max(2, Math.round(scoreValue / 10));
}

function Practice() {
  const [activeMode, setActiveMode] = useState('flashcards');
  const [lessonDeck, setLessonDeck] = useState(defaultDeck);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [draft, setDraft] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [practiceNotice, setPracticeNotice] = useState('');
  const [latestScore, setLatestScore] = useState(null);

  useEffect(() => {
    const loadPracticeDeck = async () => {
      const localLesson = getLessonById(1);
      const localLetters = localLesson?.letters || [];
      const localDeck = localLetters.slice(0, 6).map((letter) => ({
        punjabi: letter.character,
        transliteration: letter.transliteration,
        english: letter.exampleMeaning,
      }));

      if (localDeck.length > 0) {
        setLessonDeck(localDeck);
      }

      try {
        const response = await axios.get('/api/lessons/1');
        const letters = response.data?.letters || [];
        const deck = letters.slice(0, 6).map((letter) => ({
          punjabi: letter.character,
          transliteration: letter.transliteration,
          english: letter.exampleMeaning,
        }));

        if (deck.length > 0) {
          setLessonDeck(deck);
        }
      } catch (error) {
        console.warn('Using local practice deck:', error);
      }
    };

    loadPracticeDeck();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((value) => (activeMode === 'timed' && value > 0 ? value - 1 : value));
    }, 1000);

    return () => clearInterval(countdown);
  }, [activeMode]);

  const currentCard = lessonDeck[cardIndex % lessonDeck.length];
  const currentMode = useMemo(() => modeCards.find((mode) => mode.id === activeMode), [activeMode]);

  const awardPracticeXp = async (attemptResult, modeLabel) => {
    const overallScore = Number(attemptResult?.overallScore ?? attemptResult?.overall ?? 0);
    setLatestScore(overallScore);

    if (overallScore < (modeLabel === 'speaking' ? SPEECH_PASS_SCORE : HANDWRITING_PASS_SCORE)) {
      setPracticeNotice('Keep going. A higher score will save XP to your profile.');
      return;
    }

    setScore((value) => value + 1);
    setPracticeNotice(`Scored ${overallScore}/100. ${modeLabel === 'speaking' ? 'Speech' : 'Handwriting'} practice counted.`);

    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      const xpEarned = getAttemptXP(overallScore);
      await axios.post(
        '/api/progress',
        {
          xpEarned,
          lessonCompleted: false,
          lessonId: currentCard?.id || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPracticeNotice((message) => `${message} +${xpEarned} XP saved.`);
    } catch (error) {
      console.warn('Could not save practice XP:', error);
    }
  };

  const handleAdvance = () => {
    setShowAnswer(false);
    setDraft('');
    setCardIndex((value) => (value + 1) % lessonDeck.length);
    setScore((value) => value + 1);
  };

  return (
    <div className="page-shell practice-page">
      <section className="hero-panel practice-hero">
        <div>
          <p className="eyebrow">Practice lab</p>
          <h1>Every core practice mode, in one polished preview.</h1>
          <p className="lead">
            Flashcards, listening, speaking, writing, and timed challenges all live here as a single loop.
            The page uses lesson data when available so the preview feels connected to the real app.
          </p>
        </div>

        <div className="practice-metrics">
          <article className="stat-card">
            <strong>{lessonDeck.length}</strong>
            <span>Practice cards</span>
          </article>
          <article className="stat-card">
            <strong>{score}</strong>
            <span>Passing attempts</span>
          </article>
          <article className="stat-card">
            <strong>{activeMode === 'timed' ? `${timer}s` : latestScore === null ? '—' : `${latestScore}/100`}</strong>
            <span>{activeMode === 'timed' ? 'Challenge timer' : 'Latest score'}</span>
          </article>
        </div>
        {practiceNotice && <p className="practice-notice">{practiceNotice}</p>}
      </section>

      <section className="content-section">
        <div className="practice-mode-grid">
          {modeCards.map((mode) => (
            <button
              key={mode.id}
              className={`practice-mode-card ${activeMode === mode.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMode(mode.id);
                setCardIndex(0);
                setShowAnswer(false);
                setDraft('');
                setTimer(60);
              }}
            >
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <span>{mode.accent}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="content-section practice-layout">
        <div className="practice-stage">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current mode</p>
              <h2>{currentMode?.title}</h2>
            </div>
            <p className="lead section-lead">{currentMode?.description}</p>
          </div>

          <div className="practice-panel">
            {activeMode === 'flashcards' && (
              <PracticeFlashcard
                card={currentCard}
                showAnswer={showAnswer}
                setShowAnswer={setShowAnswer}
                onAdvance={handleAdvance}
              />
            )}

            {activeMode === 'listening' && (
              <PracticePrompt
                label="Listen and type the transliteration"
                prompt={currentCard.punjabi}
                hint={currentCard.english}
                draft={draft}
                setDraft={setDraft}
                answer={currentCard.transliteration}
                onAdvance={handleAdvance}
              />
            )}

            {activeMode === 'speaking' && (
              <PracticeSpeaking
                prompt={currentCard.punjabi}
                transliteration={currentCard.transliteration}
                onScored={(result) => awardPracticeXp(result, 'speaking')}
              />
            )}

            {activeMode === 'writing' && (
              <PracticeWriting
                prompt={currentCard.punjabi}
                transliteration={currentCard.transliteration}
                onScored={(result) => awardPracticeXp(result, 'writing')}
              />
            )}

            {activeMode === 'timed' && (
              <PracticeTimed prompt={currentCard.punjabi} answer={currentCard.transliteration} timer={timer} />
            )}
          </div>
        </div>

        <aside className="practice-sidecar">
          <article className="info-card">
            <h3>What this mode trains</h3>
            <p>{currentMode?.accent}</p>
          </article>
          <article className="info-card">
            <h3>Lesson connection</h3>
            <p>
              The preview loads from the Gurmukhi basics lesson so the practice surface reflects the real lesson catalog.
            </p>
          </article>
          <Link to="/lessons" className="btn-secondary block-link">
            Back to lessons
          </Link>
        </aside>
      </section>
    </div>
  );
}

function PracticeFlashcard({ card, showAnswer, setShowAnswer, onAdvance }) {
  return (
    <div className="practice-card split">
      <div className="practice-card-face">
        <p className="card-kicker">Prompt</p>
        <h3>{card.punjabi}</h3>
        <p className="muted">What is the transliteration and meaning?</p>
      </div>
      <div className="practice-card-face answer">
        <p className="card-kicker">Answer</p>
        {showAnswer ? (
          <>
            <h3>{card.transliteration}</h3>
            <p>{card.english}</p>
          </>
        ) : (
          <h3>Tap to reveal</h3>
        )}
      </div>
      <div className="practice-actions">
        <button className="btn-primary" onClick={() => setShowAnswer((value) => !value)}>
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>
        <button className="btn-secondary" onClick={onAdvance}>Next card</button>
      </div>
    </div>
  );
}

function PracticePrompt({ label, prompt, hint, draft, setDraft, answer, onAdvance }) {
  const correct = draft.trim().toLowerCase() === answer.toLowerCase();

  const speakPrompt = () => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(prompt);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="practice-card">
      <p className="card-kicker">{label}</p>
      <h3>{prompt}</h3>
      <p className="muted">Meaning: {hint}</p>
      <button className="btn-secondary" type="button" onClick={speakPrompt}>
        Play prompt
      </button>
      <input className="practice-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your answer" />
      <div className="practice-actions">
        <button className="btn-primary" onClick={onAdvance} disabled={!correct}>
          Check answer
        </button>
      </div>
      {draft && (
        <p className={correct ? 'success' : 'hint'}>
          {correct ? 'Correct. Move on.' : 'Try again and focus on the transliteration.'}
        </p>
      )}
    </div>
  );
}

function PracticeSpeaking({ prompt, transliteration, onScored }) {
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState('Use your microphone or type the transcript manually.');
  const [scoreResult, setScoreResult] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speakPrompt = () => {
    if (!window.speechSynthesis) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(prompt);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const scoreAttempt = async (transcriptValue = transcript, confidenceValue = confidence) => {
    const cleanedTranscript = transcriptValue.trim();

    if (!cleanedTranscript) {
      setFeedback('Say or type the phrase before scoring it.');
      return;
    }

    try {
      const response = await axios.post('/api/practice/speech-score', {
        expectedText: transliteration,
        transcript: cleanedTranscript,
        confidence: confidenceValue,
      });

      setScoreResult(response.data);
      setFeedback(response.data?.feedback?.[0] || 'Speaking attempt scored.');
      onScored(response.data);
    } catch (error) {
      console.warn('Speech scoring failed:', error);
      setFeedback('Could not score the attempt right now. Try again once the backend is available.');
    }
  };

  const startSpeaking = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback('Speech recognition is not available in this browser. Type the transcript manually.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setRecording(true);
    setFeedback('Listening...');

    recognition.onresult = (event) => {
      const result = event.results[0][0];
      const heard = result.transcript;
      setTranscript(heard);
      setConfidence(result.confidence || 0);
      setFeedback('Transcript captured. Scoring now.');
      scoreAttempt(heard, result.confidence || 0);
    };

    recognition.onerror = () => {
      setFeedback('Could not capture speech. Check microphone permissions and try again.');
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="practice-card">
      <p className="card-kicker">Speaking drill</p>
      <h3>{prompt}</h3>
      <p className="muted">Say: {transliteration}</p>
      <div className="practice-actions">
        <button className="btn-primary" type="button" onClick={startSpeaking}>
          {recording ? 'Listening...' : 'Start speaking'}
        </button>
        <button className="btn-secondary" type="button" onClick={speakPrompt}>
          Play prompt
        </button>
      </div>
      <textarea
        className="practice-input practice-textarea"
        rows="3"
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder="Manual transcript fallback if your browser does not support speech recognition"
      />
      <div className="practice-actions">
        <button className="btn-secondary" type="button" onClick={() => scoreAttempt()}>
          Score attempt
        </button>
      </div>
      <p className="muted">Captured confidence: {confidence ? `${Math.round(confidence * 100)}%` : '—'}</p>
      {scoreResult && (
        <div className="score-summary">
          <strong>{scoreResult.overallScore}/100</strong>
          <span>{scoreResult.feedback?.[0]}</span>
        </div>
      )}
      <p className={String(feedback).includes('scored') || String(feedback).includes('Transcript captured') ? 'success' : 'hint'}>{feedback}</p>
    </div>
  );
}

function PracticeWriting({ prompt, transliteration, onScored }) {
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const activeStrokeRef = useRef(null);
  const drawingRef = useRef(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [feedback, setFeedback] = useState('Trace the character inside the box.');
  const [scoreResult, setScoreResult] = useState(null);

  const canvasWidth = 360;
  const canvasHeight = 220;

  const redrawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = 'rgba(191, 0, 255, 0.05)';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.strokeStyle = 'rgba(191, 0, 255, 0.18)';
    context.lineWidth = 1;
    context.strokeRect(12, 12, canvasWidth - 24, canvasHeight - 24);
    context.font = '700 100px "Noto Sans Gurmukhi", "Nirmala UI", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'rgba(255, 255, 255, 0.12)';
    context.fillText(prompt, canvasWidth / 2, canvasHeight / 2 + 8);
  };

  useEffect(() => {
    redrawGuide();
    strokesRef.current = [];
    activeStrokeRef.current = null;
    drawingRef.current = false;
    setStrokeCount(0);
    setScoreResult(null);
    setFeedback('Trace the character inside the box.');
  }, [prompt]);

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      t: Date.now(),
    };
  };

  const drawPoint = (context, point, previousPoint) => {
    context.strokeStyle = '#f6ecff';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 8;
    context.beginPath();
    if (previousPoint) {
      context.moveTo(previousPoint.x, previousPoint.y);
      context.lineTo(point.x, point.y);
    } else {
      context.moveTo(point.x, point.y);
      context.lineTo(point.x + 0.1, point.y + 0.1);
    }
    context.stroke();
  };

  const startStroke = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = getCanvasPoint(event);
    const stroke = [point];
    strokesRef.current.push(stroke);
    activeStrokeRef.current = stroke;
    drawPoint(context, point);
  };

  const extendStroke = (event) => {
    if (!drawingRef.current || !activeStrokeRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const point = getCanvasPoint(event);
    const currentStroke = activeStrokeRef.current;
    const previousPoint = currentStroke[currentStroke.length - 1];
    currentStroke.push(point);
    drawPoint(context, point, previousPoint);
  };

  const endStroke = () => {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    activeStrokeRef.current = null;
    setStrokeCount(strokesRef.current.filter((stroke) => stroke.length > 0).length);
  };

  const clearCanvas = () => {
    redrawGuide();
    strokesRef.current = [];
    activeStrokeRef.current = null;
    drawingRef.current = false;
    setStrokeCount(0);
    setScoreResult(null);
    setFeedback('Canvas cleared. Start again.');
  };

  const scoreWriting = async () => {
    if (strokesRef.current.length === 0) {
      setFeedback('Draw the character before scoring it.');
      return;
    }

    try {
      const response = await axios.post('/api/practice/handwriting-score', {
        expectedCharacter: prompt,
        strokes: strokesRef.current,
        canvasWidth,
        canvasHeight,
      });

      setScoreResult(response.data);
      setFeedback(response.data?.feedback?.[0] || 'Handwriting attempt scored.');
      onScored(response.data);
    } catch (error) {
      console.warn('Handwriting scoring failed:', error);
      setFeedback('Could not score the drawing right now. Try again once the backend is available.');
    }
  };

  return (
    <div className="practice-card">
      <p className="card-kicker">Writing drill</p>
      <h3>{prompt}</h3>
      <p className="muted">Transliteration: {transliteration}</p>
      <div className="practice-actions writing-actions">
        <button className="btn-secondary" type="button" onClick={clearCanvas}>
          Clear canvas
        </button>
        <button className="btn-primary" type="button" onClick={scoreWriting}>
          Score writing
        </button>
      </div>
      <div className="practice-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="practice-canvas"
          onPointerDown={startStroke}
          onPointerMove={extendStroke}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
        />
      </div>
      <div className="score-summary">
        <strong>{scoreResult ? `${scoreResult.overall}/100` : '—'}</strong>
        <span>{strokeCount} stroke{strokeCount === 1 ? '' : 's'} captured</span>
      </div>
      {scoreResult && <p className="muted">Centering: {scoreResult.scores.centering}/100 | Coverage: {scoreResult.scores.coverage}/100</p>}
      <p className={String(feedback).includes('scored') ? 'success' : 'hint'}>{feedback}</p>
    </div>
  );
}

function PracticeTimed({ prompt, answer, timer }) {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const checkTimed = () => {
    const correct = guess.trim().toLowerCase() === answer.toLowerCase();
    setFeedback(correct ? 'Correct. Keep the pace.' : 'Try again before the clock runs out.');
  };

  return (
    <div className="practice-card">
      <p className="card-kicker">Timed challenge</p>
      <h3>{prompt}</h3>
      <p className="muted">Answer fast: {answer}</p>
      <div className="timer-ring">{timer}s</div>
      <input className="practice-input" value={guess} onChange={(event) => setGuess(event.target.value)} placeholder="Type your answer" />
      <button className="btn-primary" type="button" onClick={checkTimed}>
        Check now
      </button>
      {feedback && <p className={feedback.includes('Correct') ? 'success' : 'hint'}>{feedback}</p>}
    </div>
  );
}

export default Practice;