import { cn } from '@heroui/react';
import React from 'react';
import {
  MapContainer as LeafletMapContainer,
  MapContainerProps,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

interface Props extends MapContainerProps {
  className?: string;
}

export const MapContainer: React.FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <LeafletMapContainer
      // z-index is used so other modals don't show behind the map
      className={cn(className, 'z-0')}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafletMapContainer>
  );
};
