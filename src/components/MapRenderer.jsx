import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
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
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  const pathGenerator = useMemo(() => {
    const projection = getProjection(regionId);
    return projection ? d3.geoPath().projection(projection) : null;
  }, [regionId]);

  // Set up zoom behavior
  useEffect(() => {
    if (!svgRef.current || !interactive) return;

    const svg = d3.select(svgRef.current);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Reset zoom when region changes
    svg.call(zoom.transform, d3.zoomIdentity);
    setTransform(d3.zoomIdentity);

    return () => {
      svg.on('.zoom', null);
    };
  }, [regionId, interactive, mapData]);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
  }, []);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  if (loading) {
    return (
      <div
        className="rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: darkMode ? '#333' : '#f0f9ff',
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #bae6fd',
          height: '70vh',
          minHeight: '400px',
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
    <div className="relative">
      {/* Zoom Controls */}
      {interactive && (
        <div
          className="absolute top-3 right-3 z-10 flex flex-col gap-1"
          style={{ touchAction: 'none' }}
        >
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#e0e0e0' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#e0e0e0' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
            title="Zoom out"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-colors"
            style={{
              backgroundColor: darkMode ? '#444' : '#fff',
              color: darkMode ? '#e0e0e0' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
            title="Reset zoom"
          >
            ⟲
          </button>
        </div>
      )}

      {/* Zoom hint */}
      {interactive && transform.k === 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs"
          style={{
            backgroundColor: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
            color: darkMode ? '#999' : '#666',
          }}
        >
          Scroll to zoom • Drag to pan
        </div>
      )}

      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: oceanColor,
          border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #bae6fd',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={region.viewBox}
          className="w-full"
          style={{
            height: '70vh',
            minHeight: '400px',
            maxHeight: '80vh',
            cursor: interactive ? 'grab' : 'default',
          }}
        >
          {/* Ocean background */}
          <rect width="100%" height="100%" fill={oceanColor} />

          {/* Map features group with transform */}
          <g ref={gRef} transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
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
                  strokeWidth={(isHovered ? 2 : 0.75) / transform.k}
                  className={interactive ? "cursor-pointer transition-colors duration-150" : ""}
                  onMouseEnter={() => interactive && onFeatureHover?.(code)}
                  onMouseLeave={() => interactive && onFeatureHover?.(null)}
                  onClick={() => interactive && onFeatureClick?.(code, name)}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
