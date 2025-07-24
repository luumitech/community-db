import React from 'react';
import { useMapEvents } from 'react-leaflet';

interface Props {
  onZoomChange?: (zoom: number) => void;
}

export const MapEventListener: React.FC<Props> = ({ onZoomChange }) => {
  const mapEvents = useMapEvents({
    zoomend: () => {
      onZoomChange?.(mapEvents.getZoom());
    },
  });

  return null;
};
