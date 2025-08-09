'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { parseAsNumber } from '~/lib/number-util';
import {
  FitBound,
  MapContainer,
  MapEventListener,
  PrintControl,
} from '~/view/base/leaflet';
import { usePageContext } from './page-context';
import { PropertyMarker } from './property-marker';

interface Props {
  className?: string;
  selectedYear?: number | null;
}

export const MapView: React.FC<Props> = ({ className, selectedYear }) => {
  const { community, isMemberInYear } = usePageContext();
  const [zoom, setZoom] = React.useState<number>();

  const propertyWithGps = React.useMemo(() => {
    return community.rawPropertyList.map((entry) => ({
      id: entry.id,
      address: entry.address,
      loc: [
        parseAsNumber(entry.lat)!,
        parseAsNumber(entry.lon)!,
      ] as L.LatLngTuple,
      isMemberInYear: (year: number) => isMemberInYear(entry, year),
    }));
  }, [community, isMemberInYear]);

  const bounds = React.useMemo(() => {
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
      <PrintControl
        position="topleft"
        sizeModes={['A4Portrait', 'A4Landscape']}
        title="Export as PNG"
        exportOnly
      />
      <MapEventListener onZoomChange={setZoom} />
      <FitBound bounds={bounds} />
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
