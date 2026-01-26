import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:regionId" element={<QuizPage />} />
        <Route path="/learn/:regionId" element={<LearnPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #333' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity"
          style={{ color: '#e0e0e0', letterSpacing: '0.12em' }}
        >
          Geography Explorer
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm hover:opacity-60 transition-opacity"
            style={{ color: '#e0e0e0' }}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1c' }}>
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-12">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: '#ffffff' }}>
            Master World Geography
          </h1>
          <p className="text-lg" style={{ color: '#888' }}>
            Interactive maps to learn countries, states, and capitals
          </p>
        </div>

        {/* US States - Featured */}
        <section className="mb-16">
          <h2 className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: '#666', letterSpacing: '0.12em' }}>
            United States
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/quiz/us-states"
              className="group relative rounded-xl overflow-hidden"
              style={{ backgroundColor: '#252525' }}
            >
              <div className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' }} />
              <div className="relative p-6 flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">🇺🇸</div>
                  <h3 className="text-xl font-semibold text-white">Quiz Mode</h3>
                  <p className="text-sm text-white/70">Test your knowledge of all 50 states</p>
                </div>
                <svg className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>

            <Link
              to="/learn/us-states"
              className="group relative rounded-xl overflow-hidden"
              style={{ backgroundColor: '#252525' }}
            >
              <div className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }} />
              <div className="relative p-6 flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">🗺️</div>
                  <h3 className="text-xl font-semibold text-white">Learn Mode</h3>
                  <p className="text-sm text-white/70">Explore facts about each state</p>
                </div>
                <svg className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* Continents */}
        <section>
          <h2 className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: '#666', letterSpacing: '0.12em' }}>
            World Continents
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTINENTS.map((continent) => (
              <ContinentCard key={continent.id} continent={continent} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8" style={{ borderTop: '1px solid #333' }}>
          <p className="text-xs" style={{ color: '#555' }}>
            Built with React & D3.js · Data from REST Countries API
          </p>
        </footer>
      </div>
    </div>
  );
}

function ContinentCard({ continent }) {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{ backgroundColor: '#252525' }}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div
        className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity"
        style={{ background: continent.gradient }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{continent.emoji}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-white/80">
            {continent.count}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white mb-4">{continent.name}</h3>

        {/* Options */}
        <div className={`flex gap-2 transition-all duration-200 ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Link
            to={`/quiz/${continent.id}`}
            className="flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            Quiz
          </Link>
          <Link
            to={`/learn/${continent.id}`}
            className="flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            Learn
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuizPage() {
  const { regionId } = useParams();
  const navigate = useNavigate();

  if (!REGIONS[regionId]) {
    return <Navigate to="/" />;
  }

  return <QuizMode regionId={regionId} onBack={() => navigate('/')} />;
}

function LearnPage() {
  const { regionId } = useParams();
  const navigate = useNavigate();

  if (!REGIONS[regionId]) {
    return <Navigate to="/" />;
  }

  return <LearnMode regionId={regionId} onBack={() => navigate('/')} />;
}

function Navigate({ to }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}
