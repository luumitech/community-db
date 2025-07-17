export type { GeocodeResult } from './geocode';

/** Configuration required to access Geoapify */
export interface GeoapifyCredential {
  /** URL base path, i.e. https://api.geoapify.com */
  serverUrl: string;
  /** API Key for accessing API, get from Geoapify website */
  apiKey: string;
}
