import * as turf from '@turf/turf';
import React from 'react';
import {
  isFeatureOfTypes,
  pointInPolygon,
  toGeoPointInput,
} from '~/lib/geojson-util';
import {
  AddressSearchControl,
  GeoLocationCenter,
  LeafletDraw,
  MapContainer,
  useMapContext,
  type OnDrawChangeFn,
} from '~/view/base/map';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  setEditMode: (mode: boolean) => void;
}

export const Map: React.FC<Props> = ({ className, setEditMode }) => {
  const {} = useMapContext();
  const formMethods = useHookFormContext();
  const { setValue, clearErrors } = formMethods;

  const onDrawChange = React.useCallback<OnDrawChangeFn>(
    (geoData) => {
      let area = 0;
      let shapeNo = 0;
      const geoPoints = geoData.features.flatMap((feature) => {
        if (isFeatureOfTypes(feature, ['Polygon', 'MultiPolygon'])) {
          const featureArea = turf.area(feature);
          area += featureArea;
          shapeNo += 1;
          // Assume minimum distance between each property is 20 meters
          return pointInPolygon(feature, 20, { units: 'meters' });
        } else {
          throw new Error(`Unexpected geometry type: ${feature.geometry.type}`);
        }
      });
      const mapPoints = geoPoints.map(toGeoPointInput);
      clearErrors('map');
      setValue('map', mapPoints);
      setValue(
        'hidden.map.area',
        turf.convertArea(area, 'meters', 'kilometers')
      );
      setValue('hidden.map.shapeNo', shapeNo);

      // const lfPoints = geoPoints.map(toLeafletPoint);
      // setPts(lfPoints);
    },
    [setValue, clearErrors]
  );

  return (
    <MapContainer className={className} zoom={15} scrollWheelZoom>
      <GeoLocationCenter />
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
        onEditModeChange={setEditMode}
      />
      {/* For debug purpose, to show where the grid points are */}
      {/* {pts.map((pt, idx) => (
          <LeafletMarker key={idx} position={pt} />
        ))} */}
    </MapContainer>
  );
};
