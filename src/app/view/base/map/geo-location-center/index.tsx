import { useGeolocation } from '@uidotdev/usehooks';
import React from 'react';
import { useMap } from 'react-leaflet';

/** Access browser's geolocation and center the map on it. */

interface Props {
  zoom?: number;
}

export const GeoLocationCenter: React.FC<Props> = ({ zoom }) => {
  const map = useMap();
  const geoState = useGeolocation();

  /** If user gives permission for geo location, set it as new center for map */
  React.useEffect(() => {
    const { latitude, longitude } = geoState;
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude], zoom);
    }
  }, [map, geoState, zoom]);

  return null;
};
