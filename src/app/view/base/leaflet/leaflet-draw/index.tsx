import '@geoman-io/leaflet-geoman-free';
import type { FeatureCollection, Geometry } from 'geojson';
import React from 'react';
import { useMap } from 'react-leaflet';

import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

type ToolbarOptions = Parameters<L.Map['pm']['addControls']>[0];
export type OnDrawChangeFn = (geoData: FeatureCollection<Geometry>) => void;
export type OnEditModeChangeFn = (isEditMode: boolean) => void;

/**
 * React wrapper for leaflet-geoman
 *
 * See: https://geoman.io/docs/leaflet/
 */

export interface LeafletDrawProps {
  controls?: ToolbarOptions;
  /** Triggers whenever a shape is added, modified, removed, or moved. */
  onDrawChange?: OnDrawChangeFn;
  /**
   * Callback to notify when the edit mode changes.
   *
   * This is useful if you want to manage the edit mode state outside of this
   * component. For example, you can disable an action button while user is in
   * the process of editing the map.
   */
  onEditModeChange?: OnEditModeChangeFn;
}

export const LeafletDraw: React.FC<LeafletDrawProps> = ({
  controls,
  onDrawChange,
  onEditModeChange,
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
      layer.on('pm:edit', () => {
        // Triggered when shape enters edit mode, or being moved
        onEditModeChange?.(true);
      });
      layer.on('pm:update', () => {
        // When shape has finished edited or moved
        onChange();
        onEditModeChange?.(false);
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
    map.on('pm:drawstart', () => {
      // When drawing (creating a new shape) starts
      onEditModeChange?.(true);
    });
    map.on('pm:drawend', () => {
      // When drawing (creating a new shape) ends
      onEditModeChange?.(false);
    });

    return () => {
      map.off('pm:create');
      map.off('pm:update');
      map.off('pm:remove');
      map.off('pm:cut');
      map.off('pm:drawstart');
      map.off('pm:drawend');
      map.pm.removeControls();
    };
  }, [controls, map, onChange, onEditModeChange]);

  return null;
};
