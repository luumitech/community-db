import { useGeolocation } from '@uidotdev/usehooks';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import React from 'react';
import { useMap } from 'react-leaflet';
import { leafletMarkerIcon } from './leaflet-marker';

import 'leaflet-geosearch/dist/geosearch.css';

/**
 * React wrapper for leaflet-geosearch
 *
 * See: https://github.com/smeijer/leaflet-geosearch
 */

interface Props {
  /**
   * Geocoding provider
   *
   * Default: OpenStreetMap
   */
  provider?: OpenStreetMapProvider;
  /**
   * - Bar: text search bar
   * - Button: search button that reveals a search bar
   */
  style?: 'bar' | 'button';
  /** Text to display when address is not found */
  notFoundMessage?: string;
  /** Icon to display for reset button */
  resetButton?: string;
  /**
   * Auto complete can be configured by the parameters autoComplete and
   * autoCompleteDelay. A little delay is required to not DDOS the server on
   * every keystroke.
   *
   * Default: true
   */
  autoComplete?: boolean;
  /** Default: 250 */
  autoCompleteDelay?: boolean;
  /**
   * Determine whether or not to show a marker and/or open a popup with the
   * location text.
   *
   * Default: true
   */
  showMarker?: boolean;
  /** Default: false */
  showPopup?: boolean;
}

export const AddressSearchControl: React.FC<Props> = (props) => {
  const map = useMap();
  const geoState = useGeolocation();

  React.useEffect(() => {
    // @ts-expect-error leaflet-geosearch does not provide a typescript definition
    const control = new GeoSearchControl({
      /**
       * Note that OpenStreetMap is open, but not free without limits. They do
       * have a Usage Policy just like the other providers.
       *
       * See: https://operations.osmfoundation.org/policies/nominatim/
       *
       * For options:
       *
       * See: https://nominatim.org/release-docs/develop/api/Search/#parameters
       */
      provider: new OpenStreetMapProvider({
        params: {
          layer: 'address',
        },
      }),
      notFoundMessage: 'Sorry, that address could not be found.',
      style: 'bar',
      marker: {
        icon: leafletMarkerIcon,
        draggable: false,
      },
      ...props,
    });

    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map, props]);

  /** If user gives permission for geo location, set it as new center for map */
  React.useEffect(() => {
    const { latitude, longitude } = geoState;
    if (latitude != null && longitude != null) {
      map.setView([latitude, longitude]);
    }
  }, [map, geoState]);

  return null;
};
