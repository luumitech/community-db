import { HelcimCredential } from './credential';
import {
  General,
  HelcimPay,
  Payment,
  Resource,
  Subscriptions,
} from './resource';

export class HelcimApi {
  public general: General;
  public helcimPay: HelcimPay;
  public payment: Payment;
  public subscriptions: Subscriptions;

  constructor(credential: HelcimCredential) {
    const resource = new Resource(credential);
    this.general = new General(resource);
    this.helcimPay = new HelcimPay(resource);
    this.payment = new Payment(resource);
    this.subscriptions = new Subscriptions(resource);
  }

  /** Create API instance from current environment configuration */
  static async fromConfig() {
    const cred = await HelcimCredential.fromConfig();
    return new HelcimApi(cred);
  }
}
