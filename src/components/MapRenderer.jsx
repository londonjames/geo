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
}) {
  const { mapData, loading, error } = useMapData(regionId);
  const region = REGIONS[regionId];

  const pathGenerator = useMemo(() => {
    const projection = getProjection(regionId);
    return projection ? d3.geoPath().projection(projection) : null;
  }, [regionId]);

  if (loading) {
    return (
      <div className="bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-indigo-700 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <p className="text-red-700 font-medium">Failed to load map</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!mapData || !pathGenerator || !region) {
    return null;
  }

  return (
    <div className="bg-sky-50 rounded-xl overflow-hidden border border-sky-200">
      <svg
        viewBox={region.viewBox}
        className="w-full h-auto"
        style={{ maxHeight: '55vh' }}
      >
        {/* Ocean background */}
        <rect width="100%" height="100%" fill="#bfdbfe" />

        {/* Map features */}
        {mapData.features.map((feature) => {
          const code = region.getCode(feature);
          const name = region.getName(code);
          const path = pathGenerator(feature);

          if (!path || !name) return null;

          const isHovered = hoveredCode === code;
          const color = getFeatureColor ? getFeatureColor(code) : '#cbd5e1';

          return (
            <path
              key={code}
              d={path}
              fill={color}
              stroke="#64748b"
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
