import { cn, Spacer } from '@heroui/react';
import L from 'leaflet';
import React from 'react';
import { pointInPolygon, toLeafletPoint } from '~/lib/geojson-util';
import {
  AddressSearchControl,
  DrawEditControl,
  LeafletMarker,
  MapContainer,
  type OnCreatedFn,
  type OnEditedFn,
} from '~/view/base/leaflet';
import { StartImport } from '../start-import';

const position: L.LatLngTuple = [43.860956, -79.23397541287129];

interface Props {
  className?: string;
}

export const MethodMap: React.FC<Props> = ({ className }) => {
  const [pts, setPts] = React.useState<L.LatLng[]>([]);

  const onCreated = React.useCallback<OnCreatedFn>((evt) => {
    const { layerType } = evt;
    switch (layerType) {
      case 'polygon':
      case 'rectangle':
        {
          const { layer } = evt;
          const geojson = layer.toGeoJSON();
          const geoPoints = pointInPolygon(geojson, 20, { units: 'meters' });
          const points = geoPoints.map(toLeafletPoint);
          setPts(points);
        }
        break;

      default:
        throw new Error(`Unexpected layerType ${layerType}`);
    }
  }, []);

  const onEdited = React.useCallback<OnEditedFn>((evt) => {
    const { layers } = evt;
    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        const geojson = layer.toGeoJSON();
        const geoPoints = pointInPolygon(geojson, 20, { units: 'meters' });
        const points = geoPoints.map(toLeafletPoint);
        setPts(points);
      }
    });
  }, []);

  return (
    <>
      <MapContainer
        className={cn(className, 'grow')}
        center={position}
        zoom={15}
        scrollWheelZoom
      >
        <AddressSearchControl />
        <DrawEditControl
          position="topright"
          onCreated={onCreated}
          onEdited={onEdited}
          draw={{
            polyline: false,
            polygon: true,
            rectangle: true,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
        />
        {pts.map((pt, idx) => (
          <LeafletMarker key={idx} position={pt} />
        ))}
      </MapContainer>
      <StartImport />
      <Spacer y={1} />
    </>
  );
};
