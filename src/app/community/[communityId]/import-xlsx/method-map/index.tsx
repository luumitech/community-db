import { cn, Spacer } from '@heroui/react';
import L from 'leaflet';
import React from 'react';
import {
  isFeatureOfTypes,
  pointInPolygon,
  toGeoPointInput,
  toLeafletPoint,
} from '~/lib/geojson-util';
import {
  AddressSearchControl,
  LeafletDraw,
  LeafletMarker,
  MapContainer,
  type OnDrawChangeFn,
} from '~/view/base/leaflet';
import { StartImport } from '../start-import';
import { useHookFormContext } from '../use-hook-form';

// Toronto (That's where I live!)
const defaultPosition: L.LatLngTuple = [43.6425701, -79.3896317];

interface Props {
  className?: string;
}

export const MethodMap: React.FC<Props> = ({ className }) => {
  // const [pts, setPts] = React.useState<L.LatLng[]>([]);
  const formMethods = useHookFormContext();
  const { setValue, clearErrors } = formMethods;

  const onDrawChange = React.useCallback<OnDrawChangeFn>(
    (geoData) => {
      const geoPoints = geoData.features.flatMap((feature) => {
        if (isFeatureOfTypes(feature, ['Polygon', 'MultiPolygon'])) {
          // Assume minimum distance between each property is 20 meters
          return pointInPolygon(feature, 20, { units: 'meters' });
        } else {
          throw new Error(`Unexpected geometry type: ${feature.geometry.type}`);
        }
      });
      const mapPoints = geoPoints.map(toGeoPointInput);
      setValue('map', mapPoints);
      clearErrors('map');
      // const lfPoints = geoPoints.map(toLeafletPoint);
      // setPts(lfPoints);
    },
    [setValue, clearErrors]
  );

  return (
    <>
      <MapContainer
        className={cn(className, 'grow')}
        center={defaultPosition}
        zoom={15}
        scrollWheelZoom
      >
        <AddressSearchControl />
        <LeafletDraw
          controls={{
            position: 'topleft',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            drawCircle: false,
            drawText: false,
            editMode: true,
            rotateMode: false,
            // Enabling cut operation would complicate the grid point
            // calculation, disable for now
            cutPolygon: false,
          }}
          onDrawChange={onDrawChange}
        />
        {/* For debug purpose, to show where the grid points are */}
        {/* {pts.map((pt, idx) => (
          <LeafletMarker key={idx} position={pt} />
        ))} */}
      </MapContainer>
      <StartImport />
      <Spacer y={1} />
    </>
  );
};
