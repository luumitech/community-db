import domtoimage from 'dom-to-image';
import type { Map } from 'leaflet';

/**
 * Render map and convert into PNG
 *
 * @param map Leaflet map to convert to PNG
 * @returns URL (base64 encoded image)
 */
export async function mapToPNG(map: Map) {
  const container = map.getContainer();
  const size = map.getSize();
  const href = await domtoimage.toPng(container, {
    width: size.x,
    height: size.y,
    filter: (node: Node) => {
      const el = node as Element;
      // Remove toolbar controls from map
      if (el.classList?.contains('leaflet-control-container')) {
        return false;
      }
      return true;
    },
  });
  return href;
}
