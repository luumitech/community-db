import type { GSMod } from './_type';

/**
 * OpenStreetMap Nominatim supports a number of optional parameters. As the api
 * requires those parameters to be added to the url, they can be added to the
 * params key of the provider.
 *
 * See: https://nominatim.org/release-docs/develop/api/Search/#parameters
 */
export function openStreetMapProvider(gsMod: GSMod) {
  return new gsMod.OpenStreetMapProvider({
    params: {
      layer: 'address',
    },
  });
}
