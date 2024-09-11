import { GeoapifyCredential } from '../geoapify-credential';
import { Geocode } from './resource';

export class GeoapifyApi {
  public geocode: Geocode;

  constructor(credential: GeoapifyCredential) {
    this.geocode = new Geocode(credential);
  }

  static async fromConfig() {
    const credential = await GeoapifyCredential.fromConfig();
    return new GeoapifyApi(credential);
  }
}

export { Geocode };
