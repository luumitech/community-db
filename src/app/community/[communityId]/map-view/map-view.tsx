'use client';
import L from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { parseAsNumber } from '~/lib/number-util';
import type { MembershipList } from './_type';
import { FitBound } from './fit-bound';
import { MapEventListener } from './map-event-listener';
import { usePageContext } from './page-context';
import { PropertyMarker } from './property-marker';

import 'leaflet/dist/leaflet.css';

interface Props {
  className?: string;
  selectedYear?: number | null;
}

export const MapView: React.FC<Props> = ({ className, selectedYear }) => {
  const { community } = usePageContext();
  const [zoom, setZoom] = React.useState<number>();

  /** Check if property has membership for a given year */
  const isMember = React.useCallback(
    (membershipList: MembershipList) => (year: number) => {
      const found = membershipList.find((entry) => entry.year === year);
      return !!found?.isMember;
    },
    []
  );

  const propertyWithGps = React.useMemo(() => {
    return community.rawPropertyList.map((entry) => ({
      id: entry.id,
      address: entry.address,
      loc: [
        parseAsNumber(entry.lat)!,
        parseAsNumber(entry.lon)!,
      ] as L.LatLngTuple,
      isMemberInYear: isMember(entry.membershipList),
    }));
  }, [community, isMember]);

  const bounds = React.useMemo(() => {
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
