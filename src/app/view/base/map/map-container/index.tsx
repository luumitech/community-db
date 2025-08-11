import { cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { type MapContainerProps } from 'react-leaflet';

/**
 * Default to Toronto because that's where I live!
 *
 * The map will load tiles around this place initially
 */
const DEFAULT_POS: L.LatLngTuple = [43.6425701, -79.3896317];

const RLMapContainer = dynamic(
  async () => {
    const mod = await import('react-leaflet');
    return mod.MapContainer;
  },
  { ssr: false }
);

const TileLayer = dynamic(
  async () => {
    const mod = await import('react-leaflet');
    return mod.TileLayer;
  },
  { ssr: false }
);

interface Props extends MapContainerProps {
  className?: string;
}

export const MapContainer: React.FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RLMapContainer
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
    </RLMapContainer>
  );
};
