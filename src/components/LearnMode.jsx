import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapRenderer from './MapRenderer';
import InfoPanel from './InfoPanel';
import { REGIONS } from '../data/regions';
import { getLearnedItems, markAsLearned, getLearnProgress } from '../hooks/useProgress';

// Get total count for a region
function getRegionTotal(regionId) {
  const regionData = {
    'us-states': 50,
    'europe': 44,
    'africa': 54,
    'asia': 48,
    'north-america': 23,
    'south-america': 12,
    'oceania': 14,
  };
  return regionData[regionId] || 0;
}

export default function LearnMode({ regionId, onBack }) {
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [hoveredCode, setHoveredCode] = useState(null);
  const [learnedItems, setLearnedItems] = useState([]);

  const region = REGIONS[regionId];
  const totalCount = getRegionTotal(regionId);

  // Load learned items on mount
  useEffect(() => {
    setLearnedItems(getLearnedItems(regionId));
  }, [regionId]);

  const handleFeatureClick = useCallback((code, name) => {
    setSelectedCode(code);
    setSelectedName(name);
    // Mark as learned when clicked
    const updated = markAsLearned(regionId, code);
    setLearnedItems(updated);
  }, [regionId]);

  const handleClosePanel = useCallback(() => {
    setSelectedCode(null);
    setSelectedName(null);
  }, []);

  const getFeatureColor = useCallback((code) => {
    if (selectedCode === code) return '#e0e0e0';
    if (hoveredCode === code) return '#60a5fa';
    // Show learned items in a different color
    if (learnedItems.includes(code)) return '#4ade80';
    return '#4a5568';
  }, [selectedCode, hoveredCode, learnedItems]);

  // Initial zoom levels for different regions
  const initialZoom = regionId === 'oceania' ? 1.5 : regionId === 'europe' ? 1.2 : 1;

  const progress = getLearnProgress(regionId, totalCount);
  const entityLabel = region.entities === 'states' ? 'states' : 'countries';

  return (
    <div className="h-screen w-full flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Nav Header - sticky */}
      <header
        className="shrink-0 sticky top-0 z-30"
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

          {/* Progress - centered */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: '#fff' }}>{region.name}</span>
            <div className="w-32 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#333' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress.percentage}%`,
                  backgroundColor: progress.percentage === 100 ? '#22c55e' : '#60a5fa'
                }}
              />
            </div>
            <span className="text-sm font-medium" style={{ color: '#888' }}>
              {progress.learned}/{progress.total}
            </span>
          </div>

          {/* Placeholder for balance */}
          <div style={{ width: '100px' }}></div>
        </div>
      </header>

      {/* Main Content - Map fills remaining space */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 min-w-0">
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

        {/* Info Panel - slides in from right */}
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

      {/* Bottom progress bar */}
      {progress.learned > 0 && progress.learned < progress.total && (
        <div
          className="shrink-0 px-5 py-2 flex items-center justify-between"
          style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #333' }}
        >
          <span className="text-xs" style={{ color: '#888' }}>
            {progress.learned} {entityLabel} explored
          </span>
          <span className="text-xs" style={{ color: '#666' }}>
            {progress.total - progress.learned} more to discover
          </span>
        </div>
      )}

      {/* Completion message */}
      {progress.percentage === 100 && (
        <div
          className="shrink-0 px-5 py-2 text-center"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderTop: '1px solid rgba(34, 197, 94, 0.3)' }}
        >
          <span className="text-sm font-medium" style={{ color: '#22c55e' }}>
            🎉 You've explored all {progress.total} {entityLabel}!
          </span>
        </div>
      )}
    </div>
  );
}
