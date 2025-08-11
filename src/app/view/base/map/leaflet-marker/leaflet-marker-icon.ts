import type L from 'leaflet';

/** Render default leaflet marker icon */
export function leafletMarkerIcon(leaflet: typeof L) {
  if (!leaflet) {
    return;
  }

  const icon = leaflet.icon({
    iconUrl: '/image/leaflet/marker-icon.png',
    iconRetinaUrl: '/image/leaflet/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: '/image/leaflet/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
  return icon;
}
