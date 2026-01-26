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

  const entityLabel = region.entities === 'states' ? 'state' : 'country';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1c' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2a2a2a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#e0e0e0' }}>
              {region.emoji} Learn: {region.name}
            </h1>
            <p className="text-sm" style={{ color: '#999' }}>
              Click on any {entityLabel} to learn more about it
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#999', backgroundColor: '#333' }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className={`transition-all duration-300 ${selectedCode ? 'mr-0 sm:mr-96' : ''}`}>
          <div className="rounded-lg p-4 md:p-6" style={{ backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Hovered country name */}
            <div className="h-8 mb-2 text-center">
              {hoveredCode && !selectedCode && (
                <span className="text-lg font-medium" style={{ color: '#e0e0e0' }}>
                  {region.getName(hoveredCode)}
                </span>
              )}
              {selectedCode && (
                <span className="text-lg font-medium" style={{ color: '#999' }}>
                  {selectedName} (click another to switch)
                </span>
              )}
            </div>

            {/* Map */}
            <MapRenderer
              regionId={regionId}
              onFeatureClick={handleFeatureClick}
              onFeatureHover={setHoveredCode}
              getFeatureColor={getFeatureColor}
              hoveredCode={hoveredCode}
              darkMode={true}
            />

            {/* Instructions */}
            {!selectedCode && (
              <p className="text-center text-sm mt-4" style={{ color: '#777' }}>
                Click on any {entityLabel} to see detailed information
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {selectedCode && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 sm:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
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
  );
}
