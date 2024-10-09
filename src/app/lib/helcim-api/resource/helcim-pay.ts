import type {
  HelcimPayInitializeInput,
  HelcimPayInitializeOutput,
} from '../_type';
import { Resource, type CallArg } from './resource';

/**
 * HelcimPay.js Implementation
 *
 * See: https://devdocs.helcim.com/docs/helcimpayjs-implementation
 */
export class HelcimPay {
  constructor(private res: Resource) {}

  private async call(path: string, method: string, arg?: CallArg) {
    const url = `/v2/helcim-pay${path}`;
    return this.res.call(url, method, arg);
  }

  /**
   * Creates a HelcimPay.js Checkout Session
   *
   * See: https://devdocs.helcim.com/reference/checkout-init
   */
  async initialize(
    input: HelcimPayInitializeInput
  ): Promise<HelcimPayInitializeOutput> {
    const result = await this.call('/initialize', 'POST', {
      body: input as unknown as Record<string, unknown>,
    });

    return result;
  }
}
