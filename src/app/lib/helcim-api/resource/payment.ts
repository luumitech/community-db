import type {
  HelcimPaymentPurchaseInput,
  HelcimPaymentPurchaseOutput,
} from '../_type';
import { Resource, type CallArg } from './resource';

export class Payment {
  constructor(private res: Resource) {}

  private async call(path: string, method: string, arg?: CallArg) {
    const url = `/v2/payment${path}`;
    return this.res.call(url, method, arg);
  }

  async purchase(
    input: HelcimPaymentPurchaseInput,
    idempotentKey: string
  ): Promise<HelcimPaymentPurchaseOutput> {
    const result = await this.call('/purchase', 'POST', {
      header: {
        /**
         * You can submit any alphanumeric value for your idempotency key, but
         * they need to be 25 characters long and must be unique. The generation
         * and tracking of idempotency keys used for transactions will remain
         * the merchants responsibility.
         */
        ['idempotency-key']: idempotentKey,
      },
      body: input as unknown as Record<string, unknown>,
    });
    return result;
  }
}
