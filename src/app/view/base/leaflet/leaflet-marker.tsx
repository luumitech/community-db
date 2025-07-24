import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';

export const leafletMarkerIcon = L.icon({
  iconUrl: markerIcon.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: markerShadow.src,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

type CustomMarkerProps = Omit<MarkerProps, 'icon'>;

interface Props extends CustomMarkerProps {}

/** Render default leaflet location marker */
export const LeafletMarker: React.FC<Props> = (props) => {
  return <Marker icon={leafletMarkerIcon} {...props} />;
};
