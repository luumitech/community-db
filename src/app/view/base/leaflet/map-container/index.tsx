import { cn } from '@heroui/react';
import React from 'react';
import {
  MapContainer as LeafletMapContainer,
  MapContainerProps,
  TileLayer,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './styles.css';

/**
 * Default to Toronto because that's where I live!
 *
 * The map will load tiles around this place initially
 */
const DEFAULT_POS: L.LatLngTuple = [43.6425701, -79.3896317];

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
      center={DEFAULT_POS}
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
