import { Marker } from '@adamscybot/react-leaflet-component-marker';
import React from 'react';
import { Popup } from 'react-leaflet';
import { Icon } from '~/view/base/icon';

interface Props {
  loc: L.LatLngExpression;
  zoom?: number;
}

export const PropertyMarker: React.FC<Props> = ({ loc, zoom }) => {
  const size = React.useMemo(() => {
    if (!zoom) {
      return 0;
    } else if (zoom >= 18) {
      return 28;
    } else if (zoom >= 17) {
      return 20;
    } else if (zoom >= 16) {
      return 16;
    } else if (zoom >= 15) {
      return 8;
    } else if (zoom >= 14) {
      return 4;
    } else {
      return 0;
    }
  }, [zoom]);

  if (!size) {
    return null;
  }

  return (
    <Marker
      icon={
        <Icon
          className="text-success-600 opacity-25"
          size={size}
          icon="circle"
        />
      }
      position={loc}
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  );
};
