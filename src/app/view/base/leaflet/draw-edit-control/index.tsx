import type {
  Circle,
  LayerGroup,
  LeafletEvent,
  Marker,
  Polygon,
  Polyline,
  Rectangle,
} from 'leaflet';
import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl, EditControlProps } from 'react-leaflet-draw';

import 'leaflet-draw/dist/leaflet.draw.css';
import './styles.css';

type LeafEvent = Omit<LeafletEvent, 'layer'>;
type OnCreatedEvent = LeafEvent &
  (
    | { layerType: 'polygon'; layer: Polygon }
    | { layerType: 'rectangle'; layer: Rectangle }
    | { layerType: 'circle'; layer: Circle }
    | { layerType: 'marker'; layer: Marker }
  );
export type OnCreatedFn = (evt: OnCreatedEvent) => void;

interface OnEditedEvent extends LeafEvent {
  layers: LayerGroup;
}
export type OnEditedFn = (evt: OnEditedEvent) => void;

interface Props extends EditControlProps {}

/**
 * React leaflet draw
 *
 * - Add drawing controls to leaflet map
 *
 * See https://github.com/alex3165/react-leaflet-draw
 */
export const DrawEditControl: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  return (
    <FeatureGroup>
      <EditControl {...props} />
      {children}
    </FeatureGroup>
  );
};
