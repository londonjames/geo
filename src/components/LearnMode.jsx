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
    if (selectedCode === code) return '#6366f1'; // indigo-500
    if (hoveredCode === code) return '#60a5fa'; // blue-400
    return '#cbd5e1'; // slate-300
  }, [selectedCode, hoveredCode]);

  const entityLabel = region.entities === 'states' ? 'state' : 'country';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">
              {region.emoji} Learn: {region.name}
            </h1>
            <p className="text-indigo-600 text-sm">
              Click on any {entityLabel} to learn more about it
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className={`transition-all duration-300 ${selectedCode ? 'mr-0 sm:mr-96' : ''}`}>
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            {/* Hovered country name */}
            <div className="h-8 mb-2 text-center">
              {hoveredCode && !selectedCode && (
                <span className="text-lg font-medium text-gray-700">
                  {region.getName(hoveredCode)}
                </span>
              )}
              {selectedCode && (
                <span className="text-lg font-medium text-indigo-700">
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
            />

            {/* Instructions */}
            {!selectedCode && (
              <p className="text-center text-gray-500 text-sm mt-4">
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
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
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
