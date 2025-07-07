import { GeoapifyCredential } from './credential';
import { BatchGeocode, ForwardGeocode, Resource } from './resource';

export class GeoapifyApi {
  public forwardGeocode: ForwardGeocode;
  public batchGeocode: BatchGeocode;

  constructor(credential: GeoapifyCredential) {
    const resource = new Resource(credential);
    this.forwardGeocode = new ForwardGeocode(resource);
    this.batchGeocode = new BatchGeocode(resource);
  }

  static async fromConfig() {
    const credential = await GeoapifyCredential.fromConfig();
    return new GeoapifyApi(credential);
  }
}
