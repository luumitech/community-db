import { OpenStreetMapProvider } from 'leaflet-geosearch';

/**
 * OpenStreetMap Nominatim supports a number of optional parameters. As the api
 * requires those parameters to be added to the url, they can be added to the
 * params key of the provider.
 *
 * See: https://nominatim.org/release-docs/develop/api/Search/#parameters
 */
export function openStreetMapProvider() {
  return new OpenStreetMapProvider({
    params: {
      layer: 'address',
    },
  });
}
