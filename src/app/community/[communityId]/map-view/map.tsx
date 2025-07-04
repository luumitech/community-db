'use client';
import L from 'leaflet';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapEventListener } from './map-event-listener';
import { PropertyMarker } from './property-marker';

import 'leaflet/dist/leaflet.css';

const locList: L.LatLngExpression[] = [
  [43.862293, -79.23649398214286],
  [43.860956, -79.2339754],
];

interface Props {}

export const Map: React.FC<Props> = ({}) => {
  const [zoom, setZoom] = React.useState(17);

  return (
    <div className="h-main-height">
      <MapContainer
        className="h-full"
        center={locList[0]}
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
        {locList.map((loc, idx) => (
          <PropertyMarker key={idx} loc={loc} zoom={zoom} />
        ))}
      </MapContainer>
    </div>
  );
};
