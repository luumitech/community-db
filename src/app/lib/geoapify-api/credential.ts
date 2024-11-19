import { env } from '~/lib/env-cfg';

/** Configuration required to access Geoapify */
interface Credential {
  /** URL base path, i.e. https://api.geoapify.com */
  serverUrl: string;
  /** API Key for accessing API, get from Geoapify website */
  apiKey: string;
}

export class GeoapifyCredential {
  public serverUrl: string;
  public apiKey: string;

  constructor(cred: Credential) {
    this.serverUrl = cred.serverUrl;
    this.apiKey = cred.apiKey;
  }

  static async fromConfig() {
    return new GeoapifyCredential({
      serverUrl: env.GEOAPIFY_URL,
      apiKey: env.GEOAPIFY_KEY,
    });
  }
}
