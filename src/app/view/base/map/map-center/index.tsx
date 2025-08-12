import React from 'react';
import { useMap } from 'react-leaflet';

/** Access browser's geolocation and center the map on it. */

interface Props {
  center: L.LatLng;
  zoom?: number;
}

export const MapCenter: React.FC<Props> = ({ center, zoom }) => {
  const map = useMap();

  /** If user gives permission for geo location, set it as new center for map */
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};
