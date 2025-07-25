import { GraphQLError } from 'graphql';
import type { GeocodeResult } from './_type';
import { Resource } from './resource';

interface SearchFreeFormOutput {
  results: GeocodeResult[];
}

export class ForwardGeocode {
  constructor(private res: Resource) {}

  /**
   * The Geocoder API accepts both structured and free-form addresses as an
   * input and returns JSON, GeoJSON, and XML objects as a response. In
   * addition, you can specify location filters and preferred geographical areas
   * to make the address search more accurate and focused.
   *
   * See: https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#api
   */
  async searchFreeForm(text: string) {
    const output: SearchFreeFormOutput = await this.res.call('geocode/search', {
      method: 'GET',
      query: { text, format: 'json' },
    });

    const { results } = output;
    if (results.length === 0) {
      throw new GraphQLError('Could not find the address.');
    }

    return results[0];
  }
}
