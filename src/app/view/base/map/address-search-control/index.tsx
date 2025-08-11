import React from 'react';
import { useMap } from 'react-leaflet';
import { useMapContext } from '~/view/base/map';
import { leafletMarkerIcon } from '../leaflet-marker/leaflet-marker-icon';
import { type GSMod } from './_type';
import * as mapProvider from './map-provider';

import 'leaflet-geosearch/dist/geosearch.css';
import './styles.css';

type SearchControl = ReturnType<GSMod['GeoSearchControl']>;
type SearchControlProps = Parameters<SearchControl['initialize']>[0];

/** Result from showLocation event */
export interface ShowLocationResult<Raw = unknown> {
  bounds: [
    // S,W lat, lon
    L.LatLngBoundsLiteral,
    // N,E lat, lon
    L.LatLngBoundsLiteral,
  ];
  /** Full address returned from location search */
  label: string;
  /** Longtitude */
  x: number;
  /** Latitude */
  y: number;
  /** Result returned by provider */
  raw: Raw;
}

/**
 * React wrapper for leaflet-geosearch
 *
 * See: https://github.com/smeijer/leaflet-geosearch
 */

interface Props extends Partial<SearchControlProps> {
  onShowLocation?: (result: ShowLocationResult) => void;
  onMarkerDrag?: (loc: L.LatLng) => void;
}

export const AddressSearchControl: React.FC<Props> = ({
  marker,
  onShowLocation,
  onMarkerDrag,
  ...props
}) => {
  const { L } = useMapContext();
  const [gsmod, setGsmod] = React.useState<GSMod>();
  const map = useMap();

  React.useEffect(() => {
    (async () => {
      const mod = await import('leaflet-geosearch');
      setGsmod(mod);
    })();
  }, []);

  React.useEffect(() => {
    if (!gsmod) {
      return;
    }

    // @ts-expect-error leaflet-geosearch does not provide a typescript definition
    const control = new gsmod.GeoSearchControl({
      provider: mapProvider.openStreetMapProvider(gsmod),
      notFoundMessage: 'Sorry, that address could not be found.',
      style: 'bar',
      marker: {
        icon: leafletMarkerIcon(L),
        draggable: false,
        ...marker,
      },
      ...props,
    });

    map.addControl(control);

    // Register events
    map.on('geosearch/showlocation', (evt) => {
      // @ts-expect-error 'location' is added by geosearch
      const result: ShowLocationResult = evt.location;
      onShowLocation?.(result);
    });
    map.on('geosearch/marker/dragend', (evt) => {
      // @ts-expect-error 'location' is added by geosearch
      const loc: L.LatLng = evt.location;
      onMarkerDrag?.(loc);
    });

    return () => {
      map.off('geosearch/showlocation');
      map.off('geosearch/marker/dragend');
      map.removeControl(control);
    };
  }, [gsmod, map, props, L, marker, onShowLocation, onMarkerDrag]);

  return null;
};
