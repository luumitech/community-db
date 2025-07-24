import '@geoman-io/leaflet-geoman-free';
import type { FeatureCollection, Geometry } from 'geojson';
import React from 'react';
import { useMap } from 'react-leaflet';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

type ToolbarOptions = Parameters<L.Map['pm']['addControls']>[0];
export type OnDrawChangeFn = (geoData: FeatureCollection<Geometry>) => void;

/**
 * React wrapper for leaflet-geoman
 *
 * See: https://geoman.io/docs/leaflet/
 */

export interface LeafletDrawProps {
  controls?: ToolbarOptions;
  onDrawChange?: OnDrawChangeFn;
}

export const LeafletDraw: React.FC<LeafletDrawProps> = ({
  controls,
  onDrawChange,
}) => {
  const map = useMap();

  /**
   * This triggers whenever a shape is:
   *
   * - Added
   * - Modified
   * - Removed
   * - Moved
   */
  const onChange = React.useCallback(() => {
    const layers = map.pm.getGeomanDrawLayers(true);
    const geoData = layers.toGeoJSON() as FeatureCollection<Geometry>;
    onDrawChange?.(geoData);
  }, [map, onDrawChange]);

  React.useEffect(() => {
    map.pm.addControls(controls);

    map.on('pm:create', ({ shape, layer }) => {
      // When shape is first created
      onChange();
      layer.on('pm:update', () => {
        // When shape is edited/updated
        onChange();
      });
    });
    map.on('pm:remove', () => {
      // When shape is removed
      onChange();
    });
    map.on('pm:cut', () => {
      // When cut operation has completed
      onChange();
    });

    return () => {
      map.off('pm:create');
      map.off('pm:update');
      map.off('pm:remove');
      map.off('pm:cut');
      map.pm.removeControls();
    };
  }, [controls, map, onChange]);

  return null;
};
