import React, { useState } from 'react';
import QuizMode from './components/QuizMode';
import LearnMode from './components/LearnMode';
import { REGIONS } from './data/regions';

const REGION_LIST = [
  { id: 'europe', ...REGIONS.europe },
  { id: 'us-states', ...REGIONS['us-states'] },
  { id: 'africa', ...REGIONS.africa },
  { id: 'asia', ...REGIONS.asia },
  { id: 'north-america', ...REGIONS['north-america'] },
  { id: 'south-america', ...REGIONS['south-america'] },
  { id: 'oceania', ...REGIONS.oceania },
];

export default function App() {
  const [view, setView] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleSelectRegion = (regionId, mode) => {
    setSelectedRegion(regionId);
    setView(mode);
  };

  const handleBack = () => {
    setView('home');
    setSelectedRegion(null);
  };

  if (view === 'quiz' && selectedRegion) {
    return <QuizMode regionId={selectedRegion} onBack={handleBack} />;
  }

  if (view === 'learn' && selectedRegion) {
    return <LearnMode regionId={selectedRegion} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#1c1c1c' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#e0e0e0' }}>
            🌍 Geography Explorer
          </h1>
          <p className="text-lg" style={{ color: '#999' }}>
            Learn about countries and test your knowledge
          </p>
        </div>

        {/* Mode Selection */}
        <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#e0e0e0' }}>
            Choose a Mode
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ModeCard
              emoji="🎯"
              title="Quiz Mode"
              description="Test your knowledge! Find countries on the map as quickly as you can."
            />
            <ModeCard
              emoji="📚"
              title="Learn Mode"
              description="Explore countries! Click anywhere to discover facts, stats, and more."
            />
          </div>
        </div>

        {/* Region Selection */}
        <div className="rounded-lg p-6" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#e0e0e0' }}>
            Select a Region
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGION_LIST.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                onQuiz={() => handleSelectRegion(region.id, 'quiz')}
                onLearn={() => handleSelectRegion(region.id, 'learn')}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-8 pb-4" style={{ color: '#666' }}>
          Built with React, D3.js, and data from REST Countries API
        </p>
      </div>
    </div>
  );
}

function ModeCard({ emoji, title, description }) {
  return (
    <div
      className="rounded-lg p-5 text-center transition-all duration-200 cursor-pointer hover:scale-105"
      style={{
        backgroundColor: '#333',
        border: '2px solid rgba(255,255,255,0.15)',
      }}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg mb-1" style={{ color: '#e0e0e0' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#999' }}>{description}</p>
    </div>
  );
}

function RegionCard({ region, onQuiz, onLearn }) {
  return (
    <div
      className="rounded-lg p-4 transition-all duration-200"
      style={{
        backgroundColor: '#333',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{region.emoji}</span>
        <div>
          <h3 className="font-semibold" style={{ color: '#e0e0e0' }}>{region.name}</h3>
          <p className="text-xs" style={{ color: '#777' }}>
            {region.entities === 'states' ? '50 states' : 'Countries'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onQuiz}
          className="flex-1 py-2 px-3 text-sm font-medium rounded transition-all duration-200 hover:brightness-110"
          style={{
            backgroundColor: '#4a5568',
            color: '#e0e0e0',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          Quiz
        </button>
        <button
          onClick={onLearn}
          className="flex-1 py-2 px-3 text-sm font-medium rounded transition-all duration-200 hover:brightness-110"
          style={{
            backgroundColor: '#4a5568',
            color: '#e0e0e0',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          Learn
        </button>
      </div>
    </div>
  );
}
