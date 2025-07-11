'use client';
import L from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { parseAsNumber } from '~/lib/number-util';
import type { MembershipList } from './_type';
import { MapEventListener } from './map-event-listener';
import { usePageContext } from './page-context';
import { PropertyMarker } from './property-marker';

import 'leaflet/dist/leaflet.css';

const center: L.LatLngExpression[] = [
  [43.862293, -79.23649398214286],
  [43.860956, -79.2339754],
];

interface Props {
  className?: string;
  selectedYear?: number;
}

export const MapView: React.FC<Props> = ({ className, selectedYear }) => {
  const { community } = usePageContext();
  const [zoom, setZoom] = React.useState(17);

  /** Check if property has membership for a given year */
  const isMember = React.useCallback(
    (membershipList: MembershipList) => (year: number) => {
      const found = membershipList.find((entry) => entry.year === year);
      return !!found?.isMember;
    },
    [community]
  );

  const propertyWithGps = React.useMemo(() => {
    return community.rawPropertyList.map((entry) => ({
      id: entry.id,
      address: entry.address,
      loc: [
        parseAsNumber(entry.lat)!,
        parseAsNumber(entry.lon)!,
      ] as L.LatLngExpression,
      isMemberInYear: isMember(entry.membershipList),
    }));
  }, [community, isMember]);

  return (
    <MapContainer
      className={className}
      center={center[0]}
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
