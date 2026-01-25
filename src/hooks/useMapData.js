import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { REGIONS } from '../data/regions';

// TopoJSON to GeoJSON converter (no external library needed)
function topojsonFeature(topology, object) {
  const features = object.geometries.map(geom => ({
    type: 'Feature',
    id: geom.id,
    properties: geom.properties || {},
    geometry: topojsonGeometry(topology, geom)
  }));
  return { type: 'FeatureCollection', features };
}

function topojsonGeometry(topology, obj) {
  const { arcs, transform } = topology;

  function transformPoint(point) {
    if (!transform) return point;
    return [
      point[0] * transform.scale[0] + transform.translate[0],
      point[1] * transform.scale[1] + transform.translate[1]
    ];
  }

  function decodeArc(arcIndex) {
    const arc = arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
    const points = [];
    let x = 0, y = 0;

    for (const point of arc) {
      x += point[0];
      y += point[1];
      points.push(transformPoint([x, y]));
    }

    return arcIndex < 0 ? points.reverse() : points;
  }

  function decodeRing(arcIndices) {
    const points = [];
    for (const arcIndex of arcIndices) {
      const arcPoints = decodeArc(arcIndex);
      points.push(...(points.length ? arcPoints.slice(1) : arcPoints));
    }
    return points;
  }

  if (obj.type === 'Polygon') {
    return { type: 'Polygon', coordinates: obj.arcs.map(decodeRing) };
  } else if (obj.type === 'MultiPolygon') {
    return { type: 'MultiPolygon', coordinates: obj.arcs.map(polygon => polygon.map(decodeRing)) };
  }
  return null;
}

// Cache for loaded map data
const mapCache = {};

export function useMapData(regionId) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const region = REGIONS[regionId];
    if (!region) {
      setError(`Unknown region: ${regionId}`);
      setLoading(false);
      return;
    }

    // Check cache first
    const cacheKey = `${region.dataUrl}-${region.objectName}`;
    if (mapCache[cacheKey]) {
      const filtered = filterFeatures(mapCache[cacheKey], region);
      setMapData(filtered);
      setLoading(false);
      return;
    }

    const loadMap = async () => {
      try {
        setLoading(true);
        const response = await fetch(region.dataUrl);
        if (!response.ok) throw new Error('Failed to load map data');
        const topology = await response.json();

        const geojson = topojsonFeature(topology, topology.objects[region.objectName]);

        // Cache the full dataset
        mapCache[cacheKey] = geojson;

        // Filter to region
        const filtered = filterFeatures(geojson, region);
        setMapData(filtered);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadMap();
  }, [regionId]);

  return { mapData, loading, error };
}

function filterFeatures(geojson, region) {
  return {
    ...geojson,
    features: geojson.features.filter(region.filterFn)
  };
}

export function getProjection(regionId) {
  const region = REGIONS[regionId];
  if (!region) return null;

  if (region.projection === 'albersUsa') {
    return d3.geoAlbersUsa()
      .scale(region.scale)
      .translate(region.translate);
  }

  // Default to Mercator
  return d3.geoMercator()
    .center(region.center)
    .scale(region.scale)
    .translate(region.translate);
}
