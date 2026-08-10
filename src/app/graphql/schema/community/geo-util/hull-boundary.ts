import * as turf from '@turf/turf';
import type { MultiPolygon, Polygon } from 'geojson';
import type { GeoCoord } from '~/graphql/schema/geo/object';
import { parseAsNumber } from '~/lib/number-util';

function toTurf(propertyLocList: GeoCoord[]) {
  const points = propertyLocList.map((coord) =>
    // Note: Turf uses [lng, lat]
    turf.point([coord.lon, coord.lat])
  );
  return points;
}

function toGeoCoord(geojson: Polygon | MultiPolygon) {
  const coords = geojson.coordinates[0]; // Outer ring
  const result: GeoCoord[] = [];
  coords.forEach((coord) => {
    // Note: Turf uses [lng, lat]
    const lat = parseAsNumber(coord[1]);
    const lon = parseAsNumber(coord[0]);
    if (lat != null && lon != null) {
      result.push({ lat, lon });
    }
  });
  return result;
}

export function hullBoundary(propertyLocList: GeoCoord[]) {
  const points = turf.featureCollection(toTurf(propertyLocList));

  // Compute convex hull
  const convexPts = turf.convex(points, { concavity: 6 });
  if (convexPts) {
    const hullPts = turf.buffer(convexPts, 50, { units: 'meters' });
    if (hullPts) {
      const polygon = toGeoCoord(hullPts.geometry);
      return polygon;
    }
  }

  return [];
}
