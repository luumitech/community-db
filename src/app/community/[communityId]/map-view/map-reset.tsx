import React from 'react';
import { useMap } from 'react-leaflet';
import { ToolbarButton, ToolbarControl } from '~/view/base/map';
import { hasCoordinates } from '~/view/base/map/map-util';

interface Props {
  positions: L.LatLngBoundsLiteral;
}

/** Reset map and center map that contains all the given positions */
export const MapReset: React.FC<Props> = ({ positions }) => {
  const map = useMap();

  return (
    <ToolbarControl className="leaflet-bar" position="topleft">
      <ToolbarButton
        icon="mapCenter"
        title="Center map"
        onClick={() => {
          if (hasCoordinates(positions)) {
            map.fitBounds(positions);
          }
        }}
      />
    </ToolbarControl>
  );
};
