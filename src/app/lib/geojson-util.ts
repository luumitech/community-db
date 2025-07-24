import * as turf from '@turf/turf';
import type {
  Feature,
  GeoJsonGeometryTypes,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
import L from 'leaflet';
import * as GQL from '~/graphql/generated/graphql';

type pointGridFn = typeof turf.pointGrid;

/**
 * Generic `Feature` type guard
 *
 * @example
 *
 * ```ts
 * features.forEach((feature) => {
 *   if (isFeatureOfTypes(feature, ['Polygon', 'Point'])) {
 *     // Type is narrowed to Feature<Polygon | Point>
 *     console.log('Point or Polygon:', feature.geometry.type);
 *   }
 * });
 * ```
 */
export function isFeatureOfTypes<T extends GeoJsonGeometryTypes>(
  feature: Feature,
  types: T[]
): feature is Feature<Extract<Geometry, { type: T }>> {
  return types.includes(feature.geometry?.type as T);
}

/**
 * Generate grid points within the input `polygon` and return the points.
 *
 * @example
 *
 * ```ts
 * const points = pointInPolygon(polygon, 10, { units: 'meters' });
 * ```
 *
 * @param geo GeoJSON feature of polygons
 * @param cellSide The distance between grid points
 * @param options
 */
export function pointInPolygon(
  geo: Feature<Polygon | MultiPolygon>,
  cellSide: number,
  options: Parameters<pointGridFn>[2]
) {
  const coords = geo.geometry.coordinates as Position[][];
  const polygon = turf.polygon(coords);
  // Create bounding box on the input data
  const bbox = turf.bbox(geo);
  const grid = turf.pointGrid(bbox, cellSide, options);

  // Only keeps points that are within the polygon
  const points: Feature<Point>[] = [];
  grid.features.forEach((pt) => {
    if (turf.booleanPointInPolygon(pt, polygon)) {
      points.push(pt);
    }
  });

  return points;
}

/**
 * Convert GeoJSON point to Leaflet coordinates
 *
 * @param point Geojson point
 * @returns Leaflet LatLng
 */
export function toLeafletPoint(point: Feature<Point>) {
  const [lng, lat] = point.geometry.coordinates;
  return L.latLng(lat, lng);
}

/**
 * Convert GeoJSON point to Graphql GeoPoint Input
 *
 * @param point Geojson point
 * @returns Graphql GeoPoint Input
 */
export function toGeoPointInput(point: Feature<Point>) {
  const [lng, lat] = point.geometry.coordinates;
  const result: GQL.GeoPointInput = { lat, lon: lng };
  return result;
}
