import L from 'leaflet';
import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';

export const leafletMarkerIcon = L.icon({
  iconUrl: '/image/leaflet/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: '/image/leaflet/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

type CustomMarkerProps = Omit<MarkerProps, 'icon'>;

interface Props extends CustomMarkerProps {
  onDragEnd?: (loc: L.LatLng) => void;
}

/** Render default leaflet location marker */
export const LeafletMarker: React.FC<Props> = ({ onDragEnd, ...props }) => {
  const ref = React.useRef<L.Marker>(null);

  /** Installer event handlers for marker */
  const eventHandlers = React.useMemo(
    () => ({
      dragend: () => {
        const loc = ref.current?.getLatLng();
        if (loc != null) {
          onDragEnd?.(loc);
        }
      },
    }),
    []
  );

  return (
    <Marker
      ref={ref}
      icon={leafletMarkerIcon}
      eventHandlers={eventHandlers}
      {...props}
    />
  );
};
