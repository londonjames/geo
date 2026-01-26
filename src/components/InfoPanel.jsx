import React, { useState } from 'react';
import { useCountryData, formatPopulation, formatArea } from '../hooks/useCountryData';
import { getCountryFacts } from '../data/countryFacts';
import { getStateFacts } from '../data/stateFacts';
import { getCountryImages } from '../data/countryImages';

// Category config with enhanced colors
const CATEGORY_CONFIG = {
  records: { emoji: '🏆', title: 'Records', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
  food: { emoji: '🍜', title: 'Food & Drink', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  athletes: { emoji: '⚽', title: 'Athletes', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  gaming: { emoji: '🎯', title: 'From Here', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
  animals: { emoji: '🦁', title: 'Wildlife', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  traditions: { emoji: '🎭', title: 'Traditions', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
  history: { emoji: '📜', title: 'History', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  wildFact: { emoji: '🤯', title: 'Wild Facts', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
};

export default function InfoPanel({ code, name, regionId, onClose }) {
  const { data, loading, error } = useCountryData(code, regionId);
  const funFacts = regionId === 'us-states' ? getStateFacts(code) : getCountryFacts(code);
  const [modalData, setModalData] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

  if (!code) return null;

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 w-full sm:w-96 shadow-2xl z-50 overflow-y-auto"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10"
          style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>{name}</h2>
              {data?.nickname && (
                <p className="text-sm mt-0.5" style={{ color: '#888' }}>"{data.nickname}"</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: '#666' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80"></div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl text-center text-sm" style={{ backgroundColor: '#2d1f1f', color: '#f87171' }}>
              Failed to load data
            </div>
          )}

          {data && data.type === 'country' && <CountryInfo data={data} funFacts={funFacts} onFactClick={setModalData} onImageClick={setExpandedImage} />}
          {data && data.type === 'state' && <StateInfo data={data} name={name} funFacts={funFacts} onFactClick={setModalData} />}
        </div>
      </div>

      {/* Enhanced Fact Modal */}
      {modalData && (
        <FactModal data={modalData} onClose={() => setModalData(null)} />
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
    <div className="space-y-6">
      {/* Flag */}
      {data.flag && (
        <div className="flex justify-center">
          <img
            src={data.flag}
            alt={`Flag of ${data.name}`}
            className="h-16 w-auto rounded-lg shadow-lg"
            style={{ border: '1px solid #333' }}
          />
        </div>
      )}

      {/* Stats */}
      <div className="space-y-3">
        <StatRow label="Capital" value={data.capital} />
        <StatRow
          label="Population"
          value={formatPopulation(data.population)}
          badge={data.populationRank ? `#${data.populationRank} in world` : null}
        />
        <StatRow label="Currency" value={data.currencies?.[0]?.split(' (')?.[0] || 'N/A'} />
        <StatRow label="Region" value={data.subregion || data.region} />
      </div>

      {/* Fun Facts */}
      {funFacts && <FactsList facts={funFacts} name={data.name} onFactClick={onFactClick} />}

      {/* Country Images */}
      {images && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onImageClick(img)}
              className="relative rounded-xl overflow-hidden group"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white">
                {img.caption}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StateInfo({ data, name, funFacts, onFactClick }) {
  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="space-y-3">
        <StatRow label="Capital" value={data.capital} icon="🏛️" />
        <StatRow
          label="Population"
          value={formatPopulation(data.population)}
          badge={`#${data.populationRank} of 50`}
          icon="👥"
        />
        <StatRow
          label="Area"
          value={formatArea(data.area)}
          badge={`#${data.areaRank} of 50`}
          icon="📐"
        />
      </div>

      {/* Fun Facts */}
      {funFacts ? (
        <FactsList facts={funFacts} name={name} onFactClick={onFactClick} />
      ) : (
        <div className="text-center py-6 rounded-xl" style={{ backgroundColor: '#252525' }}>
          <p className="text-sm" style={{ color: '#666' }}>More facts coming soon!</p>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, badge, icon }) {
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-xl"
      style={{ backgroundColor: '#252525' }}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#666' }}>{label}</div>
          <div className="font-semibold" style={{ color: '#fff' }}>{value}</div>
        </div>
      </div>
      {badge && (
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: '#333', color: '#aaa' }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function FactsList({ facts, name, onFactClick }) {
  const categories = Object.entries(CATEGORY_CONFIG).filter(([key]) =>
    facts[key] && facts[key].length > 0
  );

  if (categories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wide font-medium" style={{ color: '#666' }}>
        Fun Facts
      </h3>
      {categories.map(([key, config]) => (
        <button
          key={key}
          onClick={() => onFactClick({
            category: key,
            config,
            facts: facts[key],
            name,
            allFacts: facts
          })}
          className="w-full text-left rounded-xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: config.bg,
            border: `1px solid ${config.border}`
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{config.emoji}</span>
              <span className="font-semibold" style={{ color: config.color }}>{config.title}</span>
            </div>
            <svg
              className="w-4 h-4 opacity-50"
              style={{ color: config.color }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#bbb' }}>
            {facts[key][0]}
            {facts[key].length > 1 && (
              <span style={{ color: '#666' }}> +{facts[key].length - 1} more</span>
            )}
          </p>
        </button>
      ))}
    </div>
  );
}

function FactModal({ data, onClose }) {
  const { config, facts, name, allFacts, category } = data;

  // Generate additional context based on category
  const getDeepDive = () => {
    switch(category) {
      case 'records':
        return {
          title: 'Why This Matters',
          content: `These records make ${name} truly unique. World records and firsts often shape a place's identity and attract visitors from around the globe.`,
          tip: 'Try to remember: What makes this place #1?'
        };
      case 'athletes':
        return {
          title: 'Sports Legacy',
          content: `${name} has produced incredible athletic talent. These athletes have inspired millions and put their home on the map.`,
          tip: 'Can you name any teams these athletes played for?'
        };
      case 'food':
        return {
          title: 'Culinary Heritage',
          content: `Food tells the story of a place's culture, history, and people. These dishes and traditions are beloved locally and have spread worldwide.`,
          tip: 'Have you ever tried any of these foods?'
        };
      case 'animals':
        return {
          title: 'Wildlife Wonders',
          content: `The animals that call ${name} home are adapted to its unique environment. Many can't be found anywhere else!`,
          tip: 'Think about what these animals need to survive here.'
        };
      case 'wildFact':
        return {
          title: 'The Unexpected',
          content: `Every place has surprising facts that make you say "wait, really?" These are the stories you'll want to share with friends.`,
          tip: 'Which fact surprised you the most?'
        };
      case 'history':
        return {
          title: 'Historical Significance',
          content: `Understanding history helps us appreciate how ${name} became what it is today. These events shaped the region and often the entire nation.`,
          tip: 'How might things be different if these events hadn\'t happened?'
        };
      case 'traditions':
        return {
          title: 'Cultural Traditions',
          content: `Traditions connect generations and create community. These practices have been passed down and continue to bring people together.`,
          tip: 'Do you have any similar traditions where you live?'
        };
      case 'gaming':
        return {
          title: 'Born Here',
          content: `Many things we use, eat, or enjoy every day originated in ${name}. These innovations and creations have had a global impact.`,
          tip: 'What else might have been invented or started here?'
        };
      default:
        return {
          title: 'Learn More',
          content: `There's always more to discover about ${name}.`,
          tip: 'Search online to find even more interesting facts!'
        };
    }
  };

  const deepDive = getDeepDive();

  // Get related facts from other categories
  const relatedFacts = Object.entries(CATEGORY_CONFIG)
    .filter(([key]) => key !== category && allFacts[key] && allFacts[key].length > 0)
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <div
        className="relative rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: '#1a1a1a' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.emoji}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#fff' }}>{config.title}</h3>
              <p className="text-sm" style={{ color: '#666' }}>{name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: '#666' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Facts */}
          <div className="space-y-3">
            {facts.map((fact, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: config.bg, border: `1px solid ${config.border}` }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: config.color, color: '#000' }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#ddd' }}>{fact}</p>
              </div>
            ))}
          </div>

          {/* Deep Dive Section */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#252525', border: '1px solid #333' }}
          >
            <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#fff' }}>
              <span>💡</span> {deepDive.title}
            </h4>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#aaa' }}>
              {deepDive.content}
            </p>
            <div
              className="p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#1a1a1a', color: '#888' }}
            >
              <strong>Think about it:</strong> {deepDive.tip}
            </div>
          </div>

          {/* Related Facts */}
          {relatedFacts.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wide font-medium mb-3" style={{ color: '#666' }}>
                Also Discover
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {relatedFacts.map(([key, cfg]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl text-center"
                    style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <span className="text-2xl block mb-1">{cfg.emoji}</span>
                    <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Prompt */}
          <div className="text-center pt-2">
            <p className="text-xs" style={{ color: '#555' }}>
              Want to learn more? Search "{name} {config.title.toLowerCase()}" online!
            </p>
          </div>
        </div>
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
          className="absolute -top-12 right-0 p-2 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: '#fff' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={image.url.replace('w=400', 'w=800')}
          alt={image.caption}
          className="w-full rounded-2xl"
        />
        <p className="text-center mt-4 text-lg font-medium" style={{ color: '#fff' }}>{image.caption}</p>
      </div>
    </div>
  );
}
