import { latLngBounds } from 'leaflet';

/**
 * Check if the given bounds contain any valid coordinates
 *
 * @param bounds Leaflet bounds
 * @returns
 *
 *   - True if specified bounds are valid
 *   - False if no bounds are given or if bounds are invalid
 */
export function hasCoordinates(
  bounds?: L.LatLngBoundsExpression | null
): boolean {
  if (!bounds) {
    return false;
  }

  if (Array.isArray(bounds)) {
    return latLngBounds(bounds).isValid();
  }

  return bounds.isValid();
}
