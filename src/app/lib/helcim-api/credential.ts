import { env } from '~/lib/env-cfg';

/** Configuration required to access Helcim API */
interface Credential {
  /** URL base path for accessing Odoo Api i.e. https://api.helcim.com */
  serverUrl: string;
  /** API Key */
  apiKey: string;
}

export class HelcimCredential {
  public serverUrl: string;
  public apiKey: string;

  constructor(cred: Credential) {
    this.serverUrl = cred.serverUrl;
    this.apiKey = cred.apiKey;
  }

  static async fromConfig() {
    const cred = {
      serverUrl: 'https://api.helcim.com',
      apiKey: env().payment.helcim.apiKey,
    };
    return new HelcimCredential(cred);
  }
}
