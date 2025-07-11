import { cn } from '@heroui/react';
import React from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  bounds: L.LatLngBoundsExpression;
}

export const FitBound: React.FC<Props> = ({ bounds }) => {
  const map = useMap();

  React.useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);

  return null;
};
