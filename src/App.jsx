import React, { useState } from 'react';
import QuizMode from './components/QuizMode';
import LearnMode from './components/LearnMode';
import { REGIONS } from './data/regions';

const CONTINENTS = [
  { id: 'europe', ...REGIONS.europe, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', count: '44 countries' },
  { id: 'africa', ...REGIONS.africa, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', count: '54 countries' },
  { id: 'asia', ...REGIONS.asia, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', count: '48 countries' },
  { id: 'north-america', ...REGIONS['north-america'], gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', count: '23 countries' },
  { id: 'south-america', ...REGIONS['south-america'], gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', count: '12 countries' },
  { id: 'oceania', ...REGIONS.oceania, gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', count: '14 countries' },
];

const US_STATES = { id: 'us-states', ...REGIONS['us-states'] };

export default function App() {
  const [view, setView] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mode, setMode] = useState('quiz');

  const handleSelectRegion = (regionId) => {
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
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #667eea 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, #f093fb 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: '#ffffff' }}>
            Geography Explorer
          </h1>
          <p className="text-lg mb-8" style={{ color: '#888' }}>
            Master world geography through interactive maps
          </p>

          {/* Mode Toggle */}
          <div className="inline-flex rounded-full p-1" style={{ backgroundColor: '#2a2a2a' }}>
            <button
              onClick={() => setMode('quiz')}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: mode === 'quiz' ? '#fff' : 'transparent',
                color: mode === 'quiz' ? '#000' : '#888',
              }}
            >
              Quiz Mode
            </button>
            <button
              onClick={() => setMode('learn')}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: mode === 'learn' ? '#fff' : 'transparent',
                color: mode === 'learn' ? '#000' : '#888',
              }}
            >
              Learn Mode
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* US States - Featured Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%)' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>United States</h2>
          </div>

          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => handleSelectRegion('us-states')}
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Map silhouette visual */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
              <svg viewBox="0 0 960 600" className="w-full h-full" style={{ maxHeight: '300px' }}>
                <text x="480" y="320" textAnchor="middle" fill="white" fontSize="200" fontWeight="bold" opacity="0.3">USA</text>
              </svg>
            </div>

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ minHeight: '240px' }}>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">🇺🇸</span>
                  <div>
                    <h3 className="text-3xl font-bold text-white">50 States</h3>
                    <p className="text-white/70">Learn every U.S. state and capital</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['California', 'Texas', 'New York', 'Florida', '+46 more'].map((state) => (
                    <span
                      key={state}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shrink-0"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                {mode === 'quiz' ? 'Start Quiz' : 'Explore States'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Continents Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #10b981 0%, #06b6d4 100%)' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>Explore by Continent</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTINENTS.map((continent) => (
              <ContinentCard
                key={continent.id}
                continent={continent}
                mode={mode}
                onClick={() => handleSelectRegion(continent.id)}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 text-center" style={{ borderTop: '1px solid #222' }}>
          <p className="text-sm" style={{ color: '#555' }}>
            Built with React & D3.js  •  Data from REST Countries API
          </p>
        </footer>
      </div>
    </div>
  );
}

function ContinentCard({ continent, mode, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ background: continent.gradient }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative p-6" style={{ minHeight: '180px' }}>
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{continent.emoji}</span>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.9)' }}
          >
            {continent.count}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">{continent.name}</h3>
        <p className="text-white/70 text-sm mb-4">
          {mode === 'quiz' ? 'Test your knowledge' : 'Explore and learn'}
        </p>

        <div className="flex items-center gap-2 text-white/90 text-sm font-medium group-hover:text-white transition-colors">
          <span>{mode === 'quiz' ? 'Start Quiz' : 'Start Learning'}</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
