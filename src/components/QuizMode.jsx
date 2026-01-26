import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapRenderer from './MapRenderer';
import {
  REGIONS,
  getRegionHint,
  EUROPE_MICROSTATES,
  EUROPE_COUNTRIES,
  US_STATES,
  AFRICA_COUNTRIES,
  ASIA_COUNTRIES,
  NORTH_AMERICA_COUNTRIES,
  SOUTH_AMERICA_COUNTRIES,
  OCEANIA_COUNTRIES,
} from '../data/regions';

const REGION_DATA = {
  'europe': EUROPE_COUNTRIES,
  'us-states': US_STATES,
  'africa': AFRICA_COUNTRIES,
  'asia': ASIA_COUNTRIES,
  'north-america': NORTH_AMERICA_COUNTRIES,
  'south-america': SOUTH_AMERICA_COUNTRIES,
  'oceania': OCEANIA_COUNTRIES,
};

const DIFFICULTY_LEVELS = {
  easy: { time: null, hints: true, label: 'Easy', desc: 'No time limit • Hints available' },
  medium: { time: 180, hints: false, label: 'Medium', desc: '3 minute time limit' },
  hard: { time: 90, hints: false, label: 'Hard', desc: '90 second time limit' },
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function NavBar() {
  return (
    <header
      className="shrink-0"
      style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #333' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-4">
        <Link
          to="/"
          className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity"
          style={{ color: '#e0e0e0', letterSpacing: '0.12em' }}
        >
          Geo Explorer
        </Link>
      </div>
    </header>
  );
}

export default function QuizMode({ regionId, onBack }) {
  const region = REGIONS[regionId];

  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [includeMicrostates, setIncludeMicrostates] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [answeredItems, setAnsweredItems] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hoveredCode, setHoveredCode] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentIndex];

  const getEntityList = useCallback(() => {
    const data = REGION_DATA[regionId];
    if (!data) return [];

    const allCodes = [];
    for (const [code, name] of Object.entries(data)) {
      if (regionId === 'europe' && !includeMicrostates && EUROPE_MICROSTATES.includes(code)) {
        continue;
      }
      allCodes.push({ code, name });
    }

    return allCodes;
  }, [regionId, includeMicrostates]);

  useEffect(() => {
    if (gameState !== 'playing' || !DIFFICULTY_LEVELS[difficulty].time) return;
    if (timeLeft === 0) {
      setGameState('finished');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft, difficulty]);

  const startGame = useCallback(() => {
    const entityList = getEntityList();
    const shuffled = shuffleArray(entityList);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIncorrectGuesses(0);
    setAnsweredItems({});
    setFeedback(null);
    setShowHint(false);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].time);
    setGameState('playing');
  }, [difficulty, getEntityList]);

  const handleFeatureClick = useCallback((code, name) => {
    if (gameState !== 'playing' || !currentQuestion || answeredItems[code]) return;

    if (code === currentQuestion.code) {
      setScore((prev) => prev + 1);
      setAnsweredItems((prev) => ({ ...prev, [code]: 'correct' }));
      setFeedback({ type: 'correct', message: `Correct! That's ${currentQuestion.name}!` });

      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);
        if (currentIndex + 1 >= questions.length) {
          setGameState('finished');
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 800);
    } else {
      setIncorrectGuesses((prev) => prev + 1);
      setAnsweredItems((prev) => ({ ...prev, [code]: 'wrong' }));
      setFeedback({ type: 'wrong', message: `That's ${name}. Try again!` });

      setTimeout(() => {
        setAnsweredItems((prev) => {
          const newState = { ...prev };
          if (newState[code] === 'wrong') delete newState[code];
          return newState;
        });
      }, 600);
    }
  }, [gameState, currentQuestion, currentIndex, questions.length, answeredItems]);

  const getFeatureColor = useCallback((code) => {
    if (answeredItems[code] === 'correct') return '#22c55e';
    if (answeredItems[code] === 'wrong') return '#ef4444';
    if (hoveredCode === code && gameState === 'playing' && !answeredItems[code]) return '#60a5fa';
    return '#4a5568';
  }, [answeredItems, hoveredCode, gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = score + incorrectGuesses > 0
    ? Math.round((score / (score + incorrectGuesses)) * 100)
    : 0;

  const entityLabel = region.entities === 'states' ? 'state' : 'country';
  const entityLabelPlural = region.entities === 'states' ? 'states' : 'countries';

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1c1c1c' }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">{region.emoji}</span>
              <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>
                {region.name} Quiz
              </h2>
              <p className="text-sm mt-1" style={{ color: '#666' }}>
                Find each {entityLabel} on the map
              </p>
            </div>

            {/* Difficulty options */}
            <div className="space-y-3 mb-6">
              {Object.entries(DIFFICULTY_LEVELS).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className="w-full p-4 rounded-xl transition-all text-left group"
                  style={{
                    background: difficulty === level
                      ? 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)'
                      : '#252525',
                    border: difficulty === level ? '2px solid rgba(255,255,255,0.3)' : '2px solid #333',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold" style={{ color: '#fff' }}>{config.label}</div>
                      <div className="text-sm" style={{ color: difficulty === level ? 'rgba(255,255,255,0.7)' : '#666' }}>
                        {config.desc}
                      </div>
                    </div>
                    {difficulty === level && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {regionId === 'europe' && (
              <label className="flex items-center gap-3 p-3 rounded-xl mb-6 cursor-pointer" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
                <input
                  type="checkbox"
                  checked={includeMicrostates}
                  onChange={(e) => setIncludeMicrostates(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <span style={{ color: '#ccc' }}>Include microstates (Vatican, Monaco, etc.)</span>
              </label>
            )}

            <button
              onClick={startGame}
              className="w-full py-4 font-semibold rounded-xl transition-all hover:brightness-110 text-lg"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              Start Quiz ({getEntityList().length} {entityLabelPlural})
            </button>

            <button
              onClick={onBack}
              className="w-full mt-4 py-3 text-sm transition-colors hover:text-white"
              style={{ color: '#666' }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1c1c1c' }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-4">
              {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
              {score === questions.length ? 'Perfect Score!' : 'Quiz Complete!'}
            </h2>
            <p className="text-lg mb-6" style={{ color: '#888' }}>
              {region.name}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
                <div className="text-2xl font-bold" style={{ color: '#fff' }}>{score}/{questions.length}</div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>Correct</div>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
                <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>{accuracy}%</div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>Accuracy</div>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#252525', border: '1px solid #333' }}>
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{incorrectGuesses}</div>
                <div className="text-xs mt-1" style={{ color: '#666' }}>Mistakes</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={startGame}
                className="px-6 py-3 font-semibold rounded-xl transition-all hover:brightness-110"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 font-semibold rounded-xl transition-colors"
                style={{ backgroundColor: '#333', color: '#fff', border: '1px solid #444' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen - full height map focus
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Nav bar */}
      <header
        className="shrink-0"
        style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #333' }}
      >
        <div className="px-5 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ color: '#e0e0e0', letterSpacing: '0.12em' }}
          >
            Geo Explorer
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: '#fff' }} className="font-semibold">{score}/{questions.length}</span>
            <span style={{ color: '#666' }}>{accuracy}%</span>
            {timeLeft !== null && (
              <span style={{ color: timeLeft < 15 ? '#ef4444' : '#666' }} className={timeLeft < 15 ? 'animate-pulse font-medium' : ''}>
                {formatTime(timeLeft)}
              </span>
            )}
            <button
              onClick={() => setGameState('menu')}
              className="px-3 py-1 rounded-lg text-xs"
              style={{ backgroundColor: '#333', color: '#888' }}
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* PROMINENT: Current country to find */}
      <div
        className="shrink-0 py-4 text-center"
        style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}
      >
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#e0e0e0', letterSpacing: '0.12em' }}>Find this {entityLabel}</p>
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#fff' }}>
          {currentQuestion?.name}
        </h1>
        {DIFFICULTY_LEVELS[difficulty].hints && (
          <div className="mt-2">
            {showHint ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#333', color: '#fff' }}>
                📍 Look in {getRegionHint(regionId, currentQuestion?.code)}
              </span>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 rounded-full text-sm transition-colors hover:bg-opacity-80"
                style={{ backgroundColor: '#333', color: '#888' }}
              >
                Need a hint?
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div
          className="absolute top-32 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-xl font-semibold shadow-lg"
          style={{
            backgroundColor: feedback.type === 'correct' ? '#22c55e' : '#ef4444',
            color: '#fff',
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Map fills remaining space */}
      <div className="flex-1 min-h-0">
        <MapRenderer
          regionId={regionId}
          onFeatureClick={handleFeatureClick}
          onFeatureHover={setHoveredCode}
          getFeatureColor={getFeatureColor}
          hoveredCode={hoveredCode}
          darkMode={true}
          fullHeight={true}
          initialZoom={regionId === 'oceania' ? 1.5 : regionId === 'europe' ? 1.2 : 1}
        />
      </div>

      {/* Progress bar at bottom */}
      <div className="shrink-0 h-1.5" style={{ backgroundColor: '#1a1a1a' }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${(score / questions.length) * 100}%`, backgroundColor: '#22c55e' }}
        />
      </div>
    </div>
  );
}
