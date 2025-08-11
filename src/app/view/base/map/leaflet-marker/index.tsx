import dynamic from 'next/dynamic';
import React from 'react';
import { type MarkerProps } from 'react-leaflet';
import { useMapContext } from '~/view/base/map';
import { leafletMarkerIcon } from './leaflet-marker-icon';

export type CustomMarkerProps = Omit<MarkerProps, 'icon'>;

const Marker = dynamic(
  async () => {
    const mod = await import('react-leaflet');
    return mod.Marker;
  },
  { ssr: false }
);

interface Props extends CustomMarkerProps {
  onDragEnd?: (loc: L.LatLng) => void;
}

/** Render default leaflet location marker */
export const LeafletMarker: React.FC<Props> = ({ onDragEnd, ...props }) => {
  const { L } = useMapContext();

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
    [onDragEnd]
  );

  return (
    <Marker
      ref={ref}
      icon={leafletMarkerIcon(L)}
      eventHandlers={eventHandlers}
      {...props}
    />
  );
};
