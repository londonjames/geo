import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

  // Initial zoom levels for different regions
  const initialZoom = regionId === 'oceania' ? 1.5 : regionId === 'europe' ? 1.2 : 1;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Nav Header */}
      <header
        className="shrink-0"
        style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #333' }}
      >
        <div className="px-5 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-medium tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ color: '#e0e0e0', letterSpacing: '0.12em' }}
          >
            Geo Explorer
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium" style={{ color: '#fff' }}>
              {region.emoji} {region.name}
            </span>
            {hoveredCode && (
              <span className="text-sm" style={{ color: '#888' }}>
                {region.getName(hoveredCode)}
              </span>
            )}
          </div>
        </div>
      </header>

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
            initialZoom={initialZoom}
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
