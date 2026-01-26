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
  fullHeight = false,
  initialZoom = 1,
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

    // Apply initial zoom or reset when region changes
    if (initialZoom > 1) {
      const initialTransform = d3.zoomIdentity.scale(initialZoom);
      svg.call(zoom.transform, initialTransform);
      setTransform(initialTransform);
    } else {
      svg.call(zoom.transform, d3.zoomIdentity);
      setTransform(d3.zoomIdentity);
    }

    return () => {
      svg.on('.zoom', null);
    };
  }, [regionId, interactive, mapData, initialZoom]);

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

  const containerStyle = fullHeight
    ? { height: '100%', width: '100%' }
    : { height: '70vh', minHeight: '400px', maxHeight: '80vh' };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          backgroundColor: darkMode ? '#1e3a5f' : '#f0f9ff',
          ...containerStyle,
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 border-3 border-t-transparent mx-auto mb-2"
            style={{ borderColor: darkMode ? '#e0e0e0' : '#6366f1', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-sm" style={{ color: darkMode ? '#888' : '#4338ca' }}>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          backgroundColor: darkMode ? '#2a1a1a' : '#fef2f2',
          ...containerStyle,
        }}
      >
        <div className="text-center">
          <p className="text-sm" style={{ color: '#ef4444' }}>Failed to load map</p>
        </div>
      </div>
    );
  }

  if (!mapData || !pathGenerator || !region) {
    return null;
  }

  const oceanColor = darkMode ? '#1e3a5f' : '#bfdbfe';
  const strokeColor = darkMode ? '#0d1b2a' : '#64748b';

  return (
    <div className="relative" style={fullHeight ? { height: '100%' } : {}}>
      {/* Zoom Controls */}
      {interactive && (
        <div
          className="absolute top-3 right-3 z-10 flex flex-col gap-1"
          style={{ touchAction: 'none' }}
        >
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors hover:brightness-110"
            style={{
              backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : '#fff',
              color: darkMode ? '#fff' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-colors hover:brightness-110"
            style={{
              backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : '#fff',
              color: darkMode ? '#fff' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-colors hover:brightness-110"
            style={{
              backgroundColor: darkMode ? 'rgba(0,0,0,0.5)' : '#fff',
              color: darkMode ? '#fff' : '#333',
              border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid #ddd',
            }}
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#888',
          }}
        >
          Scroll to zoom • Drag to pan
        </div>
      )}

      <div
        className={fullHeight ? '' : 'rounded-xl overflow-hidden'}
        style={{
          backgroundColor: oceanColor,
          ...(fullHeight ? { height: '100%' } : { border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #bae6fd' }),
        }}
      >
        <svg
          ref={svgRef}
          viewBox={region.viewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: '100%',
            height: fullHeight ? '100%' : undefined,
            ...(fullHeight ? {} : { height: '70vh', minHeight: '400px', maxHeight: '80vh' }),
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
