'use client';
import L from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { parseAsNumber } from '~/lib/number-util';
import { type PropertyEntry } from './_type';
import { MapEventListener } from './map-event-listener';
import { usePageContext } from './page-context';
import { PropertyMarker, type LocEntry } from './property-marker';

import 'leaflet/dist/leaflet.css';

const center: L.LatLngExpression[] = [
  [43.862293, -79.23649398214286],
  [43.860956, -79.2339754],
];

interface Props {
  className?: string;
}

export const MapView: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();
  const [zoom, setZoom] = React.useState(17);

  const propertyWithGps = React.useMemo<LocEntry[]>(() => {
    return community.rawPropertyList.map((entry) => ({
      id: entry.id,
      address: entry.address,
      loc: [parseAsNumber(entry.lat)!, parseAsNumber(entry.lon)!],
    }));
  }, [community]);

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
        <PropertyMarker key={entry.id} locEntry={entry} isMember zoom={zoom} />
      ))}
    </MapContainer>
  );
};
