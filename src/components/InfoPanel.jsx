import React from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';
import { getCountryFacts } from '../data/countryFacts';
import { getStateFacts } from '../data/stateFacts';

// Category config
const CATEGORY_CONFIG = {
  records: { emoji: '🏆', title: 'Records', bg: '#3d3520', border: 'rgba(234,179,8,0.3)' },
  food: { emoji: '🍜', title: 'Food', bg: '#3d2f20', border: 'rgba(249,115,22,0.3)' },
  athletes: { emoji: '⚽', title: 'Athletes', bg: '#203d25', border: 'rgba(34,197,94,0.3)' },
  gaming: { emoji: '🎮', title: 'From Here', bg: '#302040', border: 'rgba(168,85,247,0.3)' },
  animals: { emoji: '🐍', title: 'Animals', bg: '#3d2020', border: 'rgba(239,68,68,0.3)' },
  traditions: { emoji: '🎭', title: 'Traditions', bg: '#3d2035', border: 'rgba(236,72,153,0.3)' },
  history: { emoji: '📜', title: 'History', bg: '#3d3020', border: 'rgba(245,158,11,0.3)' },
  wildFact: { emoji: '🤯', title: 'Wild Fact', bg: '#203540', border: 'rgba(6,182,212,0.3)' },
};

export default function InfoPanel({ code, name, regionId, onClose }) {
  const { data, loading, error } = useCountryData(code, regionId);
  const funFacts = regionId === 'us-states' ? getStateFacts(code) : getCountryFacts(code);

  if (!code) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-80 shadow-2xl z-50 overflow-y-auto"
      style={{ backgroundColor: '#1c1c1c' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 px-3 py-2 flex items-center justify-between z-10"
        style={{ backgroundColor: '#252525', borderBottom: '1px solid #333' }}
      >
        <h2 className="text-lg font-semibold truncate" style={{ color: '#fff' }}>{name}</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-white/10"
          style={{ color: '#888' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80"></div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg text-center text-sm" style={{ backgroundColor: '#2d1f1f', color: '#f87171' }}>
            Failed to load data
          </div>
        )}

        {data && data.type === 'country' && <CountryInfo data={data} funFacts={funFacts} />}
        {data && data.type === 'state' && <StateInfo data={data} funFacts={funFacts} />}
      </div>
    </div>
  );
}

function CountryInfo({ data, funFacts }) {
  return (
    <div className="space-y-3">
      {/* Flag - smaller */}
      {data.flag && (
        <img
          src={data.flag}
          alt={`Flag of ${data.name}`}
          className="w-24 h-auto mx-auto rounded shadow-lg"
          style={{ border: '1px solid #333' }}
        />
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Capital" value={data.capital} />
        <StatBox label="Population" value={formatPopulation(data.population)} />
        <StatBox label="Currency" value={data.currencies?.[0]?.split(' (')?.[0] || 'N/A'} />
        <StatBox label="Region" value={data.subregion || data.region} />
      </div>

      {/* Fun Facts */}
      {funFacts && <FactsList facts={funFacts} />}

      {/* Map Link - compact */}
      {data.maps?.googleMaps && (
        <a
          href={data.maps.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#333', color: '#ccc' }}
        >
          View on Google Maps
        </a>
      )}
    </div>
  );
}

function StateInfo({ data, funFacts }) {
  return (
    <div className="space-y-3">
      {/* Quick Stats Grid with Rankings */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Capital" value={data.capital} />
        <StatBox
          label="Population"
          value={formatPopulation(data.population)}
          rank={`#${data.populationRank} of 50`}
        />
        <StatBox
          label="Area"
          value={formatArea(data.area)}
          rank={`#${data.areaRank} of 50`}
        />
        <StatBox label="Region" value={data.region} />
      </div>

      {/* Fun Facts */}
      {funFacts ? (
        <FactsList facts={funFacts} />
      ) : (
        <div className="text-center py-3 text-sm" style={{ color: '#666' }}>
          More facts coming soon!
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, rank }) {
  return (
    <div className="rounded-lg p-2" style={{ backgroundColor: '#252525' }}>
      <div className="text-sm font-semibold truncate" style={{ color: '#fff' }}>{value}</div>
      <div className="text-xs" style={{ color: '#666' }}>
        {label}
        {rank && <span style={{ color: '#888' }}> · {rank}</span>}
      </div>
    </div>
  );
}

function FactsList({ facts }) {
  const categories = Object.entries(CATEGORY_CONFIG).filter(([key]) =>
    facts[key] && facts[key].length > 0
  );

  if (categories.length === 0) return null;

  return (
    <div className="space-y-2">
      {categories.map(([key, config]) => (
        <div
          key={key}
          className="rounded-lg p-2.5"
          style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">{config.emoji}</span>
            <span className="text-xs font-semibold" style={{ color: '#ddd' }}>{config.title}</span>
          </div>
          <ul className="space-y-0.5">
            {facts[key].map((fact, i) => (
              <li key={i} className="text-xs leading-relaxed" style={{ color: '#aaa' }}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
