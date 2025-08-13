import React from 'react';
import { useMap } from 'react-leaflet';
import { Icon } from '~/view/base/icon';
import { ToolbarControl } from '~/view/base/map';

interface Props {
  positions: L.LatLngBoundsLiteral;
}

/** Reset map and center map that contains all the given positions */
export const MapReset: React.FC<Props> = ({ positions }) => {
  const map = useMap();

  return (
    <ToolbarControl className="leaflet-bar" position="topleft">
      <a
        role="button"
        title="Center map"
        onClick={() => {
          map.fitBounds(positions);
        }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <Icon icon="mapCenter" size={24} />
        </div>
      </a>
    </ToolbarControl>
  );
};
