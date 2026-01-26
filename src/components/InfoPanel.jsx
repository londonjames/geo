import React from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';
import { getCountryFacts } from '../data/countryFacts';

// Category display config with dark theme colors
const CATEGORY_CONFIG = {
  records: { emoji: '🏆', title: 'Records & Extremes', bgColor: '#3d3520', borderColor: 'rgba(234,179,8,0.3)' },
  food: { emoji: '🍜', title: 'Food', bgColor: '#3d2f20', borderColor: 'rgba(249,115,22,0.3)' },
  athletes: { emoji: '⚽', title: 'Famous Athletes', bgColor: '#203d25', borderColor: 'rgba(34,197,94,0.3)' },
  gaming: { emoji: '🎮', title: 'From Here', bgColor: '#302040', borderColor: 'rgba(168,85,247,0.3)' },
  animals: { emoji: '🐍', title: 'Dangerous Animals', bgColor: '#3d2020', borderColor: 'rgba(239,68,68,0.3)' },
  traditions: { emoji: '🎭', title: 'Bizarre Traditions', bgColor: '#3d2035', borderColor: 'rgba(236,72,153,0.3)' },
  history: { emoji: '📜', title: 'History', bgColor: '#3d3020', borderColor: 'rgba(245,158,11,0.3)' },
  wildFact: { emoji: '🤯', title: 'Wild Fact', bgColor: '#203540', borderColor: 'rgba(6,182,212,0.3)' },
};

export default function InfoPanel({ code, name, regionId, onClose }) {
  const { data, loading, error } = useCountryData(code, regionId);
  const funFacts = regionId !== 'us-states' ? getCountryFacts(code) : null;

  if (!code) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-96 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300"
      style={{ backgroundColor: '#2a2a2a' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 px-4 py-3 flex items-center justify-between z-10"
        style={{ backgroundColor: '#333', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center gap-2">
          {data?.flagEmoji && <span className="text-2xl">{data.flagEmoji}</span>}
          <h2 className="text-xl font-bold truncate" style={{ color: '#e0e0e0' }}>{name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          aria-label="Close"
        >
          <svg className="w-5 h-5" style={{ color: '#e0e0e0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent" style={{ borderColor: '#e0e0e0', borderTopColor: 'transparent' }}></div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#3d2020', border: '1px solid rgba(239,68,68,0.3)' }}>
            <p className="font-medium" style={{ color: '#ef4444' }}>Failed to load data</p>
            <p className="text-sm mt-1" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        {data && data.type === 'country' && <CountryInfo data={data} funFacts={funFacts} />}
        {data && data.type === 'state' && <StateInfo data={data} />}
      </div>
    </div>
  );
}

function CountryInfo({ data, funFacts }) {
  return (
    <div className="space-y-4">
      {/* Flag */}
      {data.flag && (
        <div className="text-center">
          <img
            src={data.flag}
            alt={`Flag of ${data.name}`}
            className="w-40 h-auto mx-auto shadow-lg rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      )}

      {/* Quick Facts - Always Show */}
      <div className="rounded-xl p-4" style={{ backgroundColor: '#333', border: '2px solid rgba(255,255,255,0.15)' }}>
        <h3 className="font-bold mb-3 flex items-center gap-2 text-lg" style={{ color: '#e0e0e0' }}>
          <span>⚡</span> Quick Facts
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickStat label="Capital" value={data.capital} />
          <QuickStat label="Population" value={formatPopulation(data.population)} />
          <QuickStat label="Currency" value={data.currencies?.[0]?.split(' (')?.[0] || 'N/A'} />
          <QuickStat label="Region" value={data.subregion || data.region} />
        </div>
      </div>

      {/* Fun Facts Categories */}
      {funFacts ? (
        <div className="space-y-3">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const facts = funFacts[key];
            if (!facts || facts.length === 0) return null;

            return (
              <FunFactCard
                key={key}
                emoji={config.emoji}
                title={config.title}
                facts={facts}
                bgColor={config.bgColor}
                borderColor={config.borderColor}
              />
            );
          })}
        </div>
      ) : (
        // Fallback for countries without curated facts
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#333', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#e0e0e0' }}>
              <span>🌍</span> Geography
            </h3>
            <div className="space-y-1 text-sm">
              <InfoRow label="Continent" value={data.continent} />
              {data.languages?.length > 0 && (
                <InfoRow label="Languages" value={data.languages.slice(0, 2).join(', ')} />
              )}
              {data.borders?.length > 0 && (
                <InfoRow label="Neighbors" value={`${data.borders.length} countries`} />
              )}
            </div>
          </div>

          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#203540', border: '1px solid rgba(96,165,250,0.3)' }}>
            <p className="text-sm" style={{ color: '#60a5fa' }}>
              🔍 More fun facts coming soon for this country!
            </p>
          </div>
        </div>
      )}

      {/* Map Link */}
      {data.maps?.googleMaps && (
        <a
          href={data.maps.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 rounded-xl font-bold transition-colors text-lg hover:brightness-110"
          style={{ backgroundColor: '#4a5568', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          🗺️ See on Map
        </a>
      )}
    </div>
  );
}

function StateInfo({ data }) {
  return (
    <div className="space-y-4">
      {/* Quick Facts */}
      <div className="rounded-xl p-4" style={{ backgroundColor: '#333', border: '2px solid rgba(255,255,255,0.15)' }}>
        <h3 className="font-bold mb-3 flex items-center gap-2 text-lg" style={{ color: '#e0e0e0' }}>
          <span>⚡</span> Quick Facts
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickStat label="Capital" value={data.capital} />
          <QuickStat label="Population" value={formatPopulation(data.population)} />
          <QuickStat label="Area" value={formatArea(data.area)} />
          <QuickStat label="Region" value={data.region} />
        </div>
      </div>

      {/* More Info */}
      <div className="rounded-xl p-4" style={{ backgroundColor: '#203d25', border: '1px solid rgba(34,197,94,0.3)' }}>
        <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#e0e0e0' }}>
          <span>📈</span> Stats
        </h3>
        <div className="space-y-1 text-sm">
          <InfoRow
            label="Population Density"
            value={`${Math.round(data.population / data.area)} per km²`}
          />
        </div>
      </div>

      <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#203540', border: '1px solid rgba(96,165,250,0.3)' }}>
        <p className="text-sm" style={{ color: '#60a5fa' }}>
          🔍 More state facts coming soon!
        </p>
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: '#444' }}>
      <div className="text-lg font-bold" style={{ color: '#e0e0e0' }}>{value}</div>
      <div className="text-xs font-medium" style={{ color: '#999' }}>{label}</div>
    </div>
  );
}

function FunFactCard({ emoji, title, facts, bgColor, borderColor }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}` }}>
      <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#e0e0e0' }}>
        <span className="text-xl">{emoji}</span> {title}
      </h3>
      <ul className="space-y-1">
        {facts.map((fact, i) => (
          <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#ccc' }}>
            <span className="mt-1" style={{ color: '#777' }}>•</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: '#999' }}>{label}</span>
      <span className="font-medium" style={{ color: '#e0e0e0' }}>{value}</span>
    </div>
  );
}
