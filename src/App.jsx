import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import QuizMode from './components/QuizMode';
import LearnMode from './components/LearnMode';
import { REGIONS } from './data/regions';

// Alphabetized continents with imagery
const CONTINENTS = [
  { id: 'africa', ...REGIONS.africa, gradient: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', count: '54 countries', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400' },
  { id: 'asia', ...REGIONS.asia, gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', count: '48 countries', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
  { id: 'europe', ...REGIONS.europe, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', count: '44 countries', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400' },
  { id: 'north-america', ...REGIONS['north-america'], gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', count: '23 countries', image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400' },
  { id: 'oceania', ...REGIONS.oceania, gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)', count: '14 countries', image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400' },
  { id: 'south-america', ...REGIONS['south-america'], gradient: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)', count: '12 countries', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400' },
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

function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: '#1c1c1c' }}>
      <NavBar />

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-5">
        {/* Hero - Single line */}
        <p className="text-lg mb-5" style={{ color: '#e0e0e0' }}>
          Think you know your way around the world? Prove it.
        </p>

        {/* US States - Featured */}
        <section className="mb-6">
          <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#666', letterSpacing: '0.12em' }}>
            United States
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/quiz/us-states"
              className="group relative rounded-xl overflow-hidden"
              style={{ backgroundColor: '#252525' }}
            >
              <div className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' }} />
              <div className="relative p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Quiz Mode</h3>
                  <p className="text-sm text-white/70">Can you go 50/50 on locating every US state? And how fast?</p>
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
              <div className="relative p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Learn Mode</h3>
                  <p className="text-sm text-white/70">What's the biggest state? The smallest? Get the facts.</p>
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
          <h2 className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#666', letterSpacing: '0.12em' }}>
            World Continents
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTINENTS.map((continent) => (
              <ContinentCard key={continent.id} continent={continent} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function ContinentCard({ continent }) {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{ backgroundColor: '#252525', minHeight: '150px' }}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${continent.image})` }}
      />
      {/* Gradient overlay - stronger at bottom */}
      <div
        className="absolute inset-0 opacity-80 group-hover:opacity-70 transition-opacity"
        style={{ background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.2) 100%)` }}
      />

      <div className="relative p-4 h-full flex flex-col justify-end">
        {/* Options - shown on hover, positioned above the title */}
        <div className={`flex gap-2 mb-2 transition-all duration-200 ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Link
            to={`/quiz/${continent.id}`}
            className="flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium text-white transition-colors backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(30, 58, 138, 0.7)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 58, 138, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 58, 138, 0.7)'}
          >
            Quiz Mode
          </Link>
          <Link
            to={`/learn/${continent.id}`}
            className="flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium text-white transition-colors backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.7)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.7)'}
          >
            Learn Mode
          </Link>
        </div>

        {/* Globe, name, and count - always at bottom */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{continent.emoji}</span>
            <h3 className="text-lg font-semibold text-white">{continent.name}</h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/90">
            {continent.count}
          </span>
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
