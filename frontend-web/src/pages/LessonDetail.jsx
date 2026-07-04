const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/api/lessons/${id}`);
        setLesson(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson');
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
      try {
        await axios.post(
            '/api/progress',
            { xpEarned: 10, lessonCompleted: true },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Lesson completed! Earned 10 XP.');
        navigate(-1);
      } catch (err) {
        console.error('Error completing lesson:', err);
        alert('Failed to complete lesson');
      }
    };

  const renderLetterUnit = (lesson, handleComplete) => {
    return (
      <div className="lesson-detail">
        <Link to="/lessons" className="btn-back">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <div className="letters-grid">
          {lesson.letters.map(letter => (
            <div key={letter.id} className="letter-card">
              <div className="letter-character">{letter.character}</div>
              <div className="letter-info">
                <div className="letter-transliteration">{letter.transliteration}</div>
                <div className="letter-pronunciation">{letter.pronunciation}</div>
                <div className="letter-example">
                  <strong>{letter.exampleWord}</strong> ({letter.exampleMeaning})
                </div>
                {letter.audioUrl && (
                  <button className="btn-audio" onClick={() => playAudio(letter.audioUrl)}>
                    🔊 Play
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleComplete} className="btn-complete">
          Complete Unit
        </button>
      </div>
    );
  };

  const renderPhraseLesson = (lesson, handleComplete) => {
    return (
      <div className="lesson-detail">
        <Link to="/lessons" className="btn-back">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <div className="phrases-list">
          {lesson.phrases.map(phrase => (
            <div key={phrase.id} className="phrase-card">
              <div className="phrase-punjabi">{phrase.punjabi}</div>
              <div className="phrase-transliteration">{phrase.transliteration}</div>
              <div className="phrase-english">{phrase.english}</div>
              <div className="phrase-pronunciation">{phrase.pronunciationTip}</div>
              {phrase.audioUrl && (
                <button className="btn-audio" onClick={() => playAudio(phrase.audioUrl)}>
                  🔊 Play
                </button>
              )}
              {phrase.culturalNote && (
                <div className="phrase-cultural-note">
                  <strong>Cultural Note:</strong> {phrase.culturalNote}
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleComplete} className="btn-complete">
          Complete Lesson
        </button>
      </div>
    );
  };

  const renderNumberLesson = (lesson, handleComplete) => {
    return (
      <div className="lesson-detail">
        <Link to="/lessons" className="btn-back">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <div className="numbers-grid">
          {lesson.numbers.map(num => (
            <div key={num.punjabi} className="number-card">
              <div className="number-punjabi">{num.punjabi}</div>
              <div className="number-transliteration">{num.transliteration}</div>
              <div className="number-english">{num.english}</div>
              <div className="number-pronunciation">{num.pronunciation}</div>
            </div>
          ))}
        </div>
        <button onClick={handleComplete} className="btn-complete">
          Complete Lesson
        </button>
      </div>
    );
  };

  const renderWordLesson = (lesson, handleComplete) => {
    return (
      <div className="lesson-detail">
        <Link to="/lessons" className="btn-back">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <div className="words-grid">
          {lesson.words.map(word => (
            <div key={word.punjabi} className="word-card">
              <div className="word-punjabi">{word.punjabi}</div>
              <div className="word-transliteration">{word.transliteration}</div>
              <div className="word-english">{word.english}</div>
              <div className="word-pronunciation">{word.pronunciation}</div>
            </div>
          ))}
        </div>
        <button onClick={handleComplete} className="btn-complete">
          Complete Lesson
        </button>
      </div>
    );
  };

  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p>{error}</p>;
  if (!lesson) return <p>Lesson not found</p>;

  if (lesson.type === 'unit' && lesson.letters) {
    return renderLetterUnit(lesson, handleComplete);
  } else if (lesson.type === 'lesson' && lesson.phrases) {
    return renderPhraseLesson(lesson, handleComplete);
  } else if (lesson.type === 'lesson' && lesson.numbers) {
    return renderNumberLesson(lesson, handleComplete);
  } else if (lesson.type === 'lesson' && lesson.words) {
    return renderWordLesson(lesson, handleComplete);
  } else {
    return (
      <div className="lesson-detail">
        <Link to="/lessons" className="btn-back">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <button onClick={handleComplete} className="btn-complete">
          Complete Lesson
        </button>
      </div>
    );
  }
};

const playAudio = (url) => {
  const audio = new Audio(url);
  audio.play().catch(e => console.log('Audio play failed:', e));
};

export default LessonDetail;