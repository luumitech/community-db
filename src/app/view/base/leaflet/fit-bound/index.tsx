import React from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  bounds: L.LatLngBoundsExpression;
}

/** Zoom map so that all coordinates within the bounds are in view */
export const FitBound: React.FC<Props> = ({ bounds }) => {
  const map = useMap();

  React.useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);

  return null;
};
