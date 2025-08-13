'use client';
import { cn } from '@heroui/react';
import React from 'react';
import {
  FitBound,
  MapContainer,
  MapEventListener,
  PrintControl,
} from '~/view/base/map';
import { HullBoundary } from './hull-boundary';
import { MapReset } from './map-reset';
import { usePageContext } from './page-context';
import { PropertyMarker } from './property-marker';

interface Props {
  className?: string;
  selectedYear?: number | null;
}

export const MapView: React.FC<Props> = ({ className, selectedYear }) => {
  const { propertyWithGps } = usePageContext();
  const [zoom, setZoom] = React.useState<number>();

  const positions = React.useMemo(() => {
    return propertyWithGps.map((entry) => entry.loc);
  }, [propertyWithGps]);

  if (propertyWithGps.length === 0) {
    return <div>No GPS Information available</div>;
  }

  return (
    <MapContainer
      className={cn(className)}
      zoom={zoom}
      zoomSnap={0}
      zoomDelta={0.25}
      scrollWheelZoom
    >
      <MapReset positions={positions} />
      <PrintControl
        position="topleft"
        sizeModes={['A4Portrait', 'A4Landscape']}
        title="Export as PNG"
        exportOnly
      />
      <MapEventListener onZoomChange={setZoom} />
      <FitBound bounds={positions} />
      <HullBoundary positions={positions} />
      {propertyWithGps.map((entry) => (
        <PropertyMarker
          key={entry.id}
          locEntry={entry}
          {...(selectedYear != null && {
            isMember: entry.isMemberInYear(selectedYear),
          })}
          zoom={zoom}
        />
      ))}
    </MapContainer>
  );
};
