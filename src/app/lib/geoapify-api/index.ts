import { Cipher } from '~/lib/cipher';
import {
  BatchGeocode,
  ForwardGeocode,
  Resource,
  type GeoapifyCredential,
} from './resource';

export class GeoapifyApi {
  public forwardGeocode: ForwardGeocode;
  public batchGeocode: BatchGeocode;

  constructor(credential: GeoapifyCredential) {
    const resource = new Resource(credential);
    this.forwardGeocode = new ForwardGeocode(resource);
    this.batchGeocode = new BatchGeocode(resource);
  }

  /**
   * Create Geoapify instance by deciphering the apiKey from database
   *
   * @param apiKey Encrypted API key (from database)
   * @returns
   */
  static fromEncryptedApiKey(encryptedApiKey: string) {
    const cipher = Cipher.fromConfig();
    const apiKey = cipher.decrypt(encryptedApiKey);
    return GeoapifyApi.fromApiKey(apiKey);
  }

  /**
   * Create Mailchimp instance by deciphering the apiKey from database
   *
   * @param apiKey Mailchip API key
   * @returns
   */
  static fromApiKey(apiKey: string) {
    const serverUrl = 'https://api.geoapify.com';
    return new GeoapifyApi({ apiKey, serverUrl });
  }
}
