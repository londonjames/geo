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

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#1c1c1c' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#e0e0e0' }}>
            {region.emoji} {region.name} Quiz
          </h1>
          <p className="text-sm" style={{ color: '#999' }}>Click on the correct {entityLabel}!</p>
        </div>

        {gameState === 'menu' && (
          <div className="rounded-lg p-8 max-w-md mx-auto" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#e0e0e0' }}>Select Difficulty</h2>

            <div className="space-y-3 mb-6">
              {Object.entries(DIFFICULTY_LEVELS).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className="w-full p-4 rounded-lg transition-all text-left"
                  style={{
                    backgroundColor: difficulty === level ? '#444' : '#333',
                    border: difficulty === level ? '2px solid #e0e0e0' : '2px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="font-semibold" style={{ color: '#e0e0e0' }}>{config.label}</div>
                  <div className="text-sm" style={{ color: '#999' }}>{config.desc}</div>
                </button>
              ))}
            </div>

            {regionId === 'europe' && (
              <label className="flex items-center gap-3 p-3 rounded-lg mb-6 cursor-pointer" style={{ backgroundColor: '#333' }}>
                <input
                  type="checkbox"
                  checked={includeMicrostates}
                  onChange={(e) => setIncludeMicrostates(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <div className="font-medium" style={{ color: '#e0e0e0' }}>Include microstates</div>
                  <div className="text-xs" style={{ color: '#777' }}>Andorra, Monaco, San Marino, Vatican, etc.</div>
                </div>
              </label>
            )}

            <button
              onClick={startGame}
              className="w-full py-4 font-bold rounded-lg transition-all text-lg hover:brightness-110"
              style={{ backgroundColor: '#4a5568', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Start Quiz
            </button>

            <p className="text-center text-sm mt-4" style={{ color: '#666' }}>
              {getEntityList().length} {entityLabelPlural} to identify
            </p>

            <button
              onClick={onBack}
              className="w-full mt-4 py-2 text-sm transition-colors"
              style={{ color: '#999' }}
            >
              ← Back to region selection
            </button>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="rounded-lg p-4 md:p-6" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: '#e0e0e0' }}>{score}/{questions.length}</div>
                  <div className="text-xs" style={{ color: '#777' }}>Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold" style={{ color: '#999' }}>{accuracy}%</div>
                  <div className="text-xs" style={{ color: '#777' }}>Accuracy</div>
                </div>
                {timeLeft !== null && (
                  <div className="text-center">
                    <div className={`text-xl font-bold ${timeLeft < 15 ? 'animate-pulse' : ''}`} style={{ color: timeLeft < 15 ? '#ef4444' : '#999' }}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs" style={{ color: '#777' }}>Time</div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setGameState('menu')}
                className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                style={{ color: '#999', backgroundColor: '#333' }}
              >
                ← Menu
              </button>
            </div>

            {/* Question */}
            <div className="text-center mb-3">
              <div className="text-sm" style={{ color: '#777' }}>Find this {entityLabel}:</div>
              <div className="text-3xl font-bold" style={{ color: '#e0e0e0' }}>{currentQuestion.name}</div>

              {DIFFICULTY_LEVELS[difficulty].hints && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-1 text-sm"
                  style={{ color: showHint ? '#666' : '#999' }}
                  disabled={showHint}
                >
                  {showHint
                    ? `📍 Look in ${getRegionHint(regionId, currentQuestion.code)}`
                    : '💡 Need a hint?'}
                </button>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className="text-center py-2 px-4 rounded-lg mb-3 font-medium text-sm"
                style={{
                  backgroundColor: feedback.type === 'correct' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: feedback.type === 'correct' ? '#22c55e' : '#ef4444',
                }}
              >
                {feedback.message}
              </div>
            )}

            {/* Map */}
            <MapRenderer
              regionId={regionId}
              onFeatureClick={handleFeatureClick}
              onFeatureHover={setHoveredCode}
              getFeatureColor={getFeatureColor}
              hoveredCode={hoveredCode}
              darkMode={true}
            />

            {/* Progress */}
            <div className="mt-3">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#333' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${(score / questions.length) * 100}%`, backgroundColor: '#e0e0e0' }}
                />
              </div>
              <div className="text-xs mt-1 text-center" style={{ color: '#777' }}>
                {score} of {questions.length} {entityLabelPlural} found
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="rounded-lg p-8 max-w-lg mx-auto text-center" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-6xl mb-4">
              {score === questions.length ? '🏆' : score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#e0e0e0' }}>
              {score === questions.length ? 'Perfect!' : 'Quiz Complete!'}
            </h2>

            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="rounded-lg p-3" style={{ backgroundColor: '#333' }}>
                <div className="text-2xl font-bold" style={{ color: '#e0e0e0' }}>{score}/{questions.length}</div>
                <div className="text-xs" style={{ color: '#777' }}>Correct</div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: '#333' }}>
                <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>{accuracy}%</div>
                <div className="text-xs" style={{ color: '#777' }}>Accuracy</div>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: '#333' }}>
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{incorrectGuesses}</div>
                <div className="text-xs" style={{ color: '#777' }}>Mistakes</div>
              </div>
            </div>

            <p className="mb-6" style={{ color: '#999' }}>
              {score === questions.length
                ? `You're a ${region.name} geography expert! 🌟`
                : score >= questions.length * 0.8
                ? `Excellent! You know ${region.name} well!`
                : score >= questions.length * 0.5
                ? `Good job! Keep exploring ${region.name}!`
                : "Keep studying the map!"}
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={startGame}
                className="px-5 py-2.5 font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#4a5568', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Play Again
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-5 py-2.5 font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#333', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Menu
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 font-semibold rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: '#333', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Regions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
