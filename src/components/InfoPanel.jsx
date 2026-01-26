import React, { useState } from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';
import { getCountryFacts } from '../data/countryFacts';
import { getStateFacts } from '../data/stateFacts';
import { getCountryImages } from '../data/countryImages';

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
  const [modalFact, setModalFact] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  if (!code) return null;

  return (
    <>
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

          {data && data.type === 'country' && <CountryInfo data={data} funFacts={funFacts} onFactClick={setModalFact} onImageClick={setExpandedImage} />}
          {data && data.type === 'state' && <StateInfo data={data} funFacts={funFacts} onFactClick={setModalFact} />}
        </div>
      </div>

      {/* Fact Modal */}
      {modalFact && (
        <FactModal fact={modalFact} onClose={() => setModalFact(null)} />
      )}

      {/* Image Modal */}
      {expandedImage && (
        <ImageModal image={expandedImage} onClose={() => setExpandedImage(null)} />
      )}
    </>
  );
}

function CountryInfo({ data, funFacts, onFactClick, onImageClick }) {
  const images = getCountryImages(data.code);

  return (
    <div className="space-y-3">
      {/* Flag - smaller */}
      {data.flag && (
        <img
          src={data.flag}
          alt={`Flag of ${data.name}`}
          className="w-20 h-auto mx-auto rounded shadow-lg"
          style={{ border: '1px solid #333' }}
        />
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Capital" value={data.capital} />
        <StatBox
          label="Population"
          value={formatPopulation(data.population)}
          rank={data.populationRank ? `#${data.populationRank}` : null}
        />
        <StatBox label="Currency" value={data.currencies?.[0]?.split(' (')?.[0] || 'N/A'} />
        <StatBox label="Region" value={data.subregion || data.region} />
      </div>

      {/* Fun Facts */}
      {funFacts && <FactsList facts={funFacts} onFactClick={onFactClick} />}

      {/* Country Images */}
      {images && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onImageClick(img)}
              className="relative rounded-lg overflow-hidden group"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1 left-1 right-1 text-xs text-white truncate">
                {img.caption}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StateInfo({ data, funFacts, onFactClick }) {
  return (
    <div className="space-y-3">
      {/* Quick Stats Grid with Rankings */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Capital" value={data.capital} />
        <StatBox
          label="Population"
          value={formatPopulation(data.population)}
          rank={`#${data.populationRank}/50`}
        />
        <StatBox label="Nickname" value={data.nickname?.replace('The ', '') || 'N/A'} small />
        <StatBox
          label="Area"
          value={formatArea(data.area)}
          rank={`#${data.areaRank}/50`}
        />
      </div>

      {/* Fun Facts */}
      {funFacts ? (
        <FactsList facts={funFacts} onFactClick={onFactClick} />
      ) : (
        <div className="text-center py-3 text-sm" style={{ color: '#666' }}>
          More facts coming soon!
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, rank, small }) {
  return (
    <div className="rounded-lg p-2" style={{ backgroundColor: '#252525' }}>
      <div className={`font-semibold truncate ${small ? 'text-xs' : 'text-sm'}`} style={{ color: '#fff' }}>{value}</div>
      <div className="text-xs" style={{ color: '#666' }}>
        {label}
        {rank && <span style={{ color: '#888' }}> · {rank}</span>}
      </div>
    </div>
  );
}

function FactsList({ facts, onFactClick }) {
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
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{config.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: '#ddd' }}>{config.title}</span>
            </div>
            <button
              onClick={() => onFactClick({ category: config.title, emoji: config.emoji, facts: facts[key] })}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Learn more"
            >
              <svg className="w-3.5 h-3.5" style={{ color: '#888' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
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

function FactModal({ fact, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="relative rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10"
          style={{ color: '#888' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{fact.emoji}</span>
          <h3 className="text-xl font-bold" style={{ color: '#fff' }}>{fact.category}</h3>
        </div>

        <ul className="space-y-3">
          {fact.facts.map((f, i) => (
            <li key={i} className="flex items-start gap-2" style={{ color: '#ccc' }}>
              <span className="mt-1" style={{ color: '#666' }}>•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs" style={{ color: '#666' }}>
          Tip: Search online to learn more about these facts!
        </p>
      </div>
    </div>
  );
}

function ImageModal({ image, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90" />
      <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full hover:bg-white/10"
          style={{ color: '#fff' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={image.url.replace('w=400', 'w=800')}
          alt={image.caption}
          className="w-full rounded-lg"
        />
        <p className="text-center mt-3 text-lg" style={{ color: '#fff' }}>{image.caption}</p>
      </div>
    </div>
  );
}
