'use client';
import React from 'react';
import {
  ExportControl,
  FitBound,
  MapContainer,
  MapEventListener,
} from '~/view/base/map';
import { Footer } from './footer';
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
      className={className}
      zoom={zoom}
      zoomSnap={0}
      zoomDelta={0.25}
      scrollWheelZoom
    >
      <MapReset positions={positions} />
      <ExportControl fileName="map.png" />
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
      <Footer />
    </MapContainer>
  );
};
