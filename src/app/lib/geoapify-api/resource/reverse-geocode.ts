import { GraphQLError } from 'graphql';
import type { GeocodeResult } from './_type';
import { Resource } from './resource';

interface ReverseSearchInput {
  lat: number;
  lon: number;
  /**
   * Maximal number of results.
   *
   * Default: 1
   */
  limit?: number;
  /** Location type */
  type?:
    | 'country'
    | 'state'
    | 'city'
    | 'postcode'
    | 'street'
    | 'amenity'
    | 'locality'
    | 'building';
}

interface ReverseSearchOutput {
  results: GeocodeResult[];
}

export class ReverseGeocode {
  constructor(private res: Resource) {}

  /**
   * It accepts the latitude/longitude coordinates pair and returns the
   * corresponding address. Optionally pass the type parameter to define address
   * level to search: city, postcode, country, etc.
   *
   * See: https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/#api
   */
  async search(input: ReverseSearchInput) {
    const output: ReverseSearchOutput = await this.res.call('geocode/reverse', {
      method: 'GET',
      query: {
        ...input,
        format: 'json',
      },
    });

    const { results } = output;
    if (results.length === 0) {
      throw new GraphQLError('Could not find the address.');
    }

    return results[0];
  }
}
