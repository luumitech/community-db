import { GeoapifyCredential } from './credential';
import { Geocode, Resource } from './resource';

export class GeoapifyApi {
  public geocode: Geocode;

  constructor(credential: GeoapifyCredential) {
    const resource = new Resource(credential);
    this.geocode = new Geocode(resource);
  }

  static async fromConfig() {
    const credential = await GeoapifyCredential.fromConfig();
    return new GeoapifyApi(credential);
  }
}
