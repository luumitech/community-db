import { HelcimCredential } from './credential';
import { General, HelcimPay, Payment, Resource } from './resource';

export class HelcimApi {
  public general: General;
  public payment: Payment;
  public helcimPay: HelcimPay;

  constructor(credential: HelcimCredential) {
    const resource = new Resource(credential);
    this.general = new General(resource);
    this.payment = new Payment(resource);
    this.helcimPay = new HelcimPay(resource);
  }

  /** Create API instance from current environment configuration */
  static async fromConfig() {
    const cred = await HelcimCredential.fromConfig();
    return new HelcimApi(cred);
  }
}
