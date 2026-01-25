import React from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';
import { getCountryFacts } from '../data/countryFacts';

// Category display config
const CATEGORY_CONFIG = {
  records: { emoji: '🏆', title: 'Records & Extremes', color: 'bg-yellow-50 border-yellow-200' },
  food: { emoji: '🍜', title: 'Food', color: 'bg-orange-50 border-orange-200' },
  athletes: { emoji: '⚽', title: 'Famous Athletes', color: 'bg-green-50 border-green-200' },
  gaming: { emoji: '🎮', title: 'From Here', color: 'bg-purple-50 border-purple-200' },
  animals: { emoji: '🐍', title: 'Dangerous Animals', color: 'bg-red-50 border-red-200' },
  traditions: { emoji: '🎭', title: 'Bizarre Traditions', color: 'bg-pink-50 border-pink-200' },
  history: { emoji: '📜', title: 'History', color: 'bg-amber-50 border-amber-200' },
  wildFact: { emoji: '🤯', title: 'Wild Fact', color: 'bg-cyan-50 border-cyan-200' },
};

export default function InfoPanel({ code, name, regionId, onClose }) {
  const { data, loading, error } = useCountryData(code, regionId);
  const funFacts = regionId !== 'us-states' ? getCountryFacts(code) : null;

  if (!code) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {data?.flagEmoji && <span className="text-2xl">{data.flagEmoji}</span>}
          <h2 className="text-xl font-bold text-white truncate">{name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            <p className="font-medium">Failed to load data</p>
            <p className="text-sm mt-1">{error}</p>
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
            className="w-40 h-auto mx-auto shadow-lg rounded-lg border"
          />
        </div>
      )}

      {/* Quick Facts - Always Show */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 border-2 border-indigo-200">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
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
                colorClass={config.color}
              />
            );
          })}
        </div>
      ) : (
        // Fallback for countries without curated facts
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
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

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
            <p className="text-blue-700 text-sm">
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
          className="block text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors text-lg"
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
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 border-2 border-indigo-200">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
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
      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span>📈</span> Stats
        </h3>
        <div className="space-y-1 text-sm">
          <InfoRow
            label="Population Density"
            value={`${Math.round(data.population / data.area)} per km²`}
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
        <p className="text-blue-700 text-sm">
          🔍 More state facts coming soon!
        </p>
      </div>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-2 text-center shadow-sm">
      <div className="text-lg font-bold text-indigo-700">{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  );
}

function FunFactCard({ emoji, title, facts, colorClass }) {
  return (
    <div className={`${colorClass} rounded-xl p-4 border-2`}>
      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-xl">{emoji}</span> {title}
      </h3>
      <ul className="space-y-1">
        {facts.map((fact, i) => (
          <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
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
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
