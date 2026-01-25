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
  const [view, setView] = useState('home'); // home, quiz, learn
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-2">
            🌍 Geography Explorer
          </h1>
          <p className="text-indigo-600 text-lg">
            Learn about countries and test your knowledge
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Choose a Mode
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ModeCard
              emoji="🎯"
              title="Quiz Mode"
              description="Test your knowledge! Find countries on the map as quickly as you can."
              color="indigo"
            />
            <ModeCard
              emoji="📚"
              title="Learn Mode"
              description="Explore countries! Click anywhere to discover facts, stats, and more."
              color="emerald"
            />
          </div>
        </div>

        {/* Region Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
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
        <p className="text-center text-gray-400 text-sm mt-8 pb-4">
          Built with React, D3.js, and data from REST Countries API
        </p>
      </div>
    </div>
  );
}

function ModeCard({ emoji, title, description, color }) {
  const colors = {
    indigo: 'bg-indigo-50 border-indigo-200',
    emerald: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div className={`${colors[color]} border-2 rounded-xl p-4 text-center`}>
      <div className="text-4xl mb-2">{emoji}</div>
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  );
}

function RegionCard({ region, onQuiz, onLearn }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{region.emoji}</span>
        <div>
          <h3 className="font-bold text-gray-800">{region.name}</h3>
          <p className="text-gray-500 text-xs">
            {region.entities === 'states' ? '50 states' : 'Countries'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onQuiz}
          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Quiz
        </button>
        <button
          onClick={onLearn}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Learn
        </button>
      </div>
    </div>
  );
}
