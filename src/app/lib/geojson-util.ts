import * as turf from '@turf/turf';
import type {
  Feature,
  GeoJsonGeometryTypes,
  Geometry,
  Point,
  Polygon,
  Position,
} from 'geojson';
import * as GQL from '~/graphql/generated/graphql';

type pointGridFn = typeof turf.pointGrid;

/** Check if the given coordinate is a valid geo coordinate */
export function isValidCoordinate(coord: {
  lat?: number | null;
  lon?: number | null;
}): coord is GQL.GeoPointInput {
  const { lat, lon } = coord;
  return (
    typeof lon === 'number' &&
    typeof lat === 'number' &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

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
  geo: Feature<Polygon>,
  cellSide: number,
  options: Parameters<pointGridFn>[2]
) {
  const coords = geo.geometry.coordinates;
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
 * Convert GeoJSON point to Graphql GeoPoint Input
 *
 * @param point Geojson point
 * @returns Graphql GeoPoint Input
 */
export function toGqlGeoPointInput(point: Feature<Point>) {
  const [lng, lat] = point.geometry.coordinates;
  const result: GQL.GeoPointInput = { lat, lon: lng };
  return result;
}

/**
 * Convert GeoJSON polygon to Graphql GeoPolygon Input
 *
 * @param polygon Geojson polygon
 * @returns Graphql GeoPolygon Input
 */
export function toGqlGeoPolygonInput(polygon: Feature<Polygon>) {
  const rings: GQL.GeoRingInput[] = polygon.geometry.coordinates.map((ring) => {
    const ringCoords: GQL.GeoPointInput[] = ring.map(([lng, lat]) => ({
      lat,
      lon: lng,
    }));
    return { ring: ringCoords };
  });

  const result: GQL.GeoPolygonInput = { polygon: rings };
  return result;
}

/**
 * Convert Graphql GeoPolygon Input to GeoJSON polygon feature
 *
 * @param input Graphql GeoPolygon Input
 * @returns Geojson polygon
 */
export function toGeoPolygon(input: GQL.GeoPolygonInput): Feature<Polygon> {
  const coordinates: Position[][] = input.polygon.map(({ ring }) =>
    ring.map(({ lon: lng, lat }) => [lng, lat])
  );
  return turf.polygon(coordinates);
}
