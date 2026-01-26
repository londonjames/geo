import React, { useState, useCallback } from 'react';
import MapRenderer from './MapRenderer';
import InfoPanel from './InfoPanel';
import { REGIONS } from '../data/regions';

export default function LearnMode({ regionId, onBack }) {
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [hoveredCode, setHoveredCode] = useState(null);

  const region = REGIONS[regionId];

  const handleFeatureClick = useCallback((code, name) => {
    setSelectedCode(code);
    setSelectedName(name);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCode(null);
    setSelectedName(null);
  }, []);

  const getFeatureColor = useCallback((code) => {
    if (selectedCode === code) return '#e0e0e0';
    if (hoveredCode === code) return '#60a5fa';
    return '#4a5568';
  }, [selectedCode, hoveredCode]);

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Compact Header */}
      <div className="shrink-0 px-4 py-2 flex items-center justify-between" style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: '#888' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: '#fff' }}>
              {region.emoji} {region.name}
            </h1>
          </div>
        </div>
        {hoveredCode && (
          <span className="text-sm" style={{ color: '#888' }}>
            {region.getName(hoveredCode)}
          </span>
        )}
      </div>

      {/* Main Content - Map fills remaining space */}
      <div className="flex-1 flex min-h-0">
        {/* Map Container - full left side */}
        <div className={`flex-1 transition-all duration-200 ${selectedCode ? 'sm:mr-80' : ''}`}>
          <MapRenderer
            regionId={regionId}
            onFeatureClick={handleFeatureClick}
            onFeatureHover={setHoveredCode}
            getFeatureColor={getFeatureColor}
            hoveredCode={hoveredCode}
            darkMode={true}
            fullHeight={true}
          />
        </div>

        {/* Info Panel */}
        {selectedCode && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-40 sm:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              onClick={handleClosePanel}
            />
            <InfoPanel
              code={selectedCode}
              name={selectedName}
              regionId={regionId}
              onClose={handleClosePanel}
            />
          </>
        )}
      </div>
    </div>
  );
}
