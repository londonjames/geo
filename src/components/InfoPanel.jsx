import React from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';

export default function InfoPanel({ code, name, regionId, onClose }) {
  const { data, loading, error } = useCountryData(code, regionId);

  if (!code) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 truncate">{name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {data && data.type === 'country' && <CountryInfo data={data} />}
        {data && data.type === 'state' && <StateInfo data={data} />}
      </div>
    </div>
  );
}

function CountryInfo({ data }) {
  return (
    <div className="space-y-6">
      {/* Flag and Name */}
      <div className="text-center">
        {data.flag && (
          <img
            src={data.flag}
            alt={`Flag of ${data.name}`}
            className="w-32 h-auto mx-auto shadow-md rounded"
          />
        )}
        <p className="text-6xl mt-2">{data.flagEmoji}</p>
        {data.officialName !== data.name && (
          <p className="text-gray-500 text-sm mt-2">{data.officialName}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📊</span> Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Capital" value={data.capital} />
          <StatItem label="Population" value={formatPopulation(data.population)} />
          <StatItem label="Area" value={formatArea(data.area)} />
          <StatItem label="Region" value={data.subregion || data.region} />
        </div>
      </div>

      {/* Geography */}
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🌍</span> Geography
        </h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Continent" value={data.continent} />
          <InfoRow label="Landlocked" value={data.landlocked ? 'Yes' : 'No'} />
          {data.borders.length > 0 && (
            <InfoRow label="Borders" value={`${data.borders.length} countries`} />
          )}
          <InfoRow label="Timezones" value={data.timezones.length === 1 ? data.timezones[0] : `${data.timezones.length} zones`} />
          <InfoRow label="Driving side" value={data.car === 'left' ? 'Left' : 'Right'} />
        </div>
      </div>

      {/* People & Culture */}
      <div className="bg-amber-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>👥</span> People & Culture
        </h3>
        <div className="space-y-2 text-sm">
          {data.languages.length > 0 && (
            <InfoRow label="Languages" value={data.languages.slice(0, 3).join(', ')} />
          )}
          {data.currencies.length > 0 && (
            <InfoRow label="Currency" value={data.currencies[0]} />
          )}
          {data.gini && (
            <InfoRow label="Inequality (Gini)" value={data.gini.toFixed(1)} />
          )}
        </div>
      </div>

      {/* Government */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🏛️</span> Status
        </h3>
        <div className="space-y-2 text-sm">
          <InfoRow label="Independent" value={data.independent ? 'Yes' : 'No'} />
          <InfoRow label="UN Member" value={data.unMember ? 'Yes' : 'No'} />
        </div>
      </div>

      {/* Map Link */}
      {data.maps?.googleMaps && (
        <a
          href={data.maps.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          Open in Google Maps 🗺️
        </a>
      )}
    </div>
  );
}

function StateInfo({ data }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📊</span> Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Capital" value={data.capital} />
          <StatItem label="Population" value={formatPopulation(data.population)} />
          <StatItem label="Area" value={formatArea(data.area)} />
          <StatItem label="Region" value={data.region} />
        </div>
      </div>

      {/* Density */}
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📈</span> Demographics
        </h3>
        <div className="space-y-2 text-sm">
          <InfoRow
            label="Population Density"
            value={`${(data.population / data.area).toFixed(1)} per km²`}
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-2 text-center">
      <div className="text-lg font-bold text-indigo-700">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
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
