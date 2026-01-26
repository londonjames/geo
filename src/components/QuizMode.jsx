import React, { useState, useCallback, useEffect } from 'react';
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="rounded-xl p-6 w-full max-w-sm" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#fff' }}>
            {region.emoji} {region.name} Quiz
          </h2>

          <div className="space-y-2 mb-4">
            {Object.entries(DIFFICULTY_LEVELS).map(([level, config]) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className="w-full p-3 rounded-lg transition-all text-left"
                style={{
                  backgroundColor: difficulty === level ? '#333' : '#252525',
                  border: difficulty === level ? '2px solid #fff' : '2px solid transparent',
                }}
              >
                <div className="font-medium text-sm" style={{ color: '#fff' }}>{config.label}</div>
                <div className="text-xs" style={{ color: '#888' }}>{config.desc}</div>
              </button>
            ))}
          </div>

          {regionId === 'europe' && (
            <label className="flex items-center gap-2 p-2 rounded-lg mb-4 cursor-pointer text-sm" style={{ backgroundColor: '#252525' }}>
              <input
                type="checkbox"
                checked={includeMicrostates}
                onChange={(e) => setIncludeMicrostates(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span style={{ color: '#ccc' }}>Include microstates</span>
            </label>
          )}

          <button
            onClick={startGame}
            className="w-full py-3 font-semibold rounded-lg transition-all hover:brightness-110"
            style={{ backgroundColor: '#fff', color: '#000' }}
          >
            Start Quiz ({getEntityList().length} {entityLabelPlural})
          </button>

          <button
            onClick={onBack}
            className="w-full mt-3 py-2 text-sm transition-colors"
            style={{ color: '#666' }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0d0d0d' }}>
        <div className="rounded-xl p-6 w-full max-w-sm text-center" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <div className="text-5xl mb-3">
            {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '📚'}
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#fff' }}>
            {score === questions.length ? 'Perfect!' : 'Quiz Complete!'}
          </h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-lg p-2" style={{ backgroundColor: '#252525' }}>
              <div className="text-xl font-bold" style={{ color: '#fff' }}>{score}/{questions.length}</div>
              <div className="text-xs" style={{ color: '#666' }}>Correct</div>
            </div>
            <div className="rounded-lg p-2" style={{ backgroundColor: '#252525' }}>
              <div className="text-xl font-bold" style={{ color: '#22c55e' }}>{accuracy}%</div>
              <div className="text-xs" style={{ color: '#666' }}>Accuracy</div>
            </div>
            <div className="rounded-lg p-2" style={{ backgroundColor: '#252525' }}>
              <div className="text-xl font-bold" style={{ color: '#ef4444' }}>{incorrectGuesses}</div>
              <div className="text-xs" style={{ color: '#666' }}>Mistakes</div>
            </div>
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={startGame}
              className="px-4 py-2 font-medium rounded-lg"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 font-medium rounded-lg"
              style={{ backgroundColor: '#333', color: '#fff' }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing screen - full height map focus
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Compact top bar */}
      <div className="shrink-0 px-3 py-2 flex items-center justify-between" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGameState('menu')}
            className="p-1.5 rounded-lg hover:bg-white/10"
            style={{ color: '#888' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3 text-sm">
            <span style={{ color: '#fff' }} className="font-semibold">{score}/{questions.length}</span>
            <span style={{ color: '#666' }}>{accuracy}%</span>
            {timeLeft !== null && (
              <span style={{ color: timeLeft < 15 ? '#ef4444' : '#666' }} className={timeLeft < 15 ? 'animate-pulse font-medium' : ''}>
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Current question - prominent */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold" style={{ color: '#fff' }}>{currentQuestion?.name}</span>
          {DIFFICULTY_LEVELS[difficulty].hints && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs px-2 py-1 rounded"
              style={{ backgroundColor: '#333', color: '#888' }}
            >
              Hint
            </button>
          )}
        </div>

        {/* Hint display */}
        {showHint && (
          <span className="text-xs" style={{ color: '#888' }}>
            📍 {getRegionHint(regionId, currentQuestion?.code)}
          </span>
        )}
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div
          className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: feedback.type === 'correct' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
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
        />
      </div>

      {/* Progress bar at bottom */}
      <div className="shrink-0 h-1" style={{ backgroundColor: '#1a1a1a' }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${(score / questions.length) * 100}%`, backgroundColor: '#22c55e' }}
        />
      </div>
    </div>
  );
}
