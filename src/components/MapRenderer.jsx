import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useMapData, getProjection } from '../hooks/useMapData';
import { REGIONS } from '../data/regions';

export default function MapRenderer({
  regionId,
  onFeatureClick,
  onFeatureHover,
  getFeatureColor,
  hoveredCode,
  interactive = true,
  darkMode = false,
}) {
  const { mapData, loading, error } = useMapData(regionId);
  const region = REGIONS[regionId];

  const pathGenerator = useMemo(() => {
    const projection = getProjection(regionId);
    return projection ? d3.geoPath().projection(projection) : null;
  }, [regionId]);

  if (loading) {
    return (
      <div
        className="rounded-xl flex items-center justify-center h-96"
        style={{
          backgroundColor: darkMode ? '#333' : '#f0f9ff',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #bae6fd',
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-3"
            style={{ borderColor: darkMode ? '#e0e0e0' : '#6366f1', borderTopColor: 'transparent' }}
          ></div>
          <p className="font-medium" style={{ color: darkMode ? '#e0e0e0' : '#4338ca' }}>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{
          backgroundColor: darkMode ? '#3a2a2a' : '#fef2f2',
          border: darkMode ? '1px solid rgba(239,68,68,0.3)' : '1px solid #fecaca',
        }}
      >
        <div className="text-4xl mb-3">⚠️</div>
        <p className="font-medium" style={{ color: '#ef4444' }}>Failed to load map</p>
        <p className="text-sm mt-1" style={{ color: darkMode ? '#f87171' : '#dc2626' }}>{error}</p>
      </div>
    );
  }

  if (!mapData || !pathGenerator || !region) {
    return null;
  }

  const oceanColor = darkMode ? '#1e3a5f' : '#bfdbfe';
  const strokeColor = darkMode ? '#1c1c1c' : '#64748b';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: oceanColor,
        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #bae6fd',
      }}
    >
      <svg
        viewBox={region.viewBox}
        className="w-full h-auto"
        style={{ maxHeight: '55vh' }}
      >
        {/* Ocean background */}
        <rect width="100%" height="100%" fill={oceanColor} />

        {/* Map features */}
        {mapData.features.map((feature) => {
          const code = region.getCode(feature);
          const name = region.getName(code);
          const path = pathGenerator(feature);

          if (!path || !name) return null;

          const isHovered = hoveredCode === code;
          const color = getFeatureColor ? getFeatureColor(code) : (darkMode ? '#4a5568' : '#cbd5e1');

          return (
            <path
              key={code}
              d={path}
              fill={color}
              stroke={strokeColor}
              strokeWidth={isHovered ? 2 : 0.75}
              className={interactive ? "cursor-pointer transition-all duration-150" : ""}
              onMouseEnter={() => interactive && onFeatureHover?.(code)}
              onMouseLeave={() => interactive && onFeatureHover?.(null)}
              onClick={() => interactive && onFeatureClick?.(code, name)}
            />
          );
        })}
      </svg>
    </div>
  );
}
