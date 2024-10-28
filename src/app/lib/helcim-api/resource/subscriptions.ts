import { StatusCodes } from 'http-status-codes';
import { HttpError } from '~/lib/http-error';
import type {
  HelcimSubscriptionsCreateInput,
  HelcimSubscriptionsCreateOutput,
  HelcimSubscriptionsDeleteInput,
  HelcimSubscriptionsGetSingleInput,
  HelcimSubscriptionsGetSingleOutput,
  HelcimSubscriptionsPatchInput,
  HelcimSubscriptionsPatchOutput,
} from '../_type';
import { Resource, type CallArg } from './resource';

export class Subscriptions {
  constructor(private res: Resource) {}

  private async call(path: string, method: string, arg?: CallArg) {
    const url = `/v2/subscriptions${path}`;
    const result = await this.res.call(url, method, arg);
    return result;
  }

  /**
   * Create one or more subscriptions to your payment plans.
   *
   * https://devdocs.helcim.com/v2.2/reference/subscription-create
   */
  async create(
    input: HelcimSubscriptionsCreateInput,
    idempotentKey: string
  ): Promise<HelcimSubscriptionsCreateOutput> {
    const result = await this.call('', 'POST', {
      header: {
        /**
         * You can submit any alphanumeric value for your idempotency key, but
         * they need to be 25 characters long and must be unique. The generation
         * and tracking of idempotency keys used for transactions will remain
         * the merchants responsibility.
         */
        ['idempotency-key']: idempotentKey,
      },
      body: {
        subscriptions: [input],
      },
    });
    return result;
  }

  /**
   * Get subscription
   *
   * https://devdocs.helcim.com/v2.2/reference/subscription-single
   */
  async getSingle(
    input: HelcimSubscriptionsGetSingleInput
  ): Promise<HelcimSubscriptionsGetSingleOutput> {
    const queryStr = new URLSearchParams({
      includeSubObjects: input.includeSubObjects ? 'true' : 'false',
    }).toString();
    const result: HelcimSubscriptionsGetSingleOutput = await this.call(
      `/${input.subscriptionId}?${queryStr}`,
      'GET'
    );
    if (result.status != 'ok') {
      throw new HttpError('Subscription not found', StatusCodes.BAD_REQUEST);
    }
    return result;
  }

  /**
   * Patch subscription
   *
   * https://devdocs.helcim.com/v2.2/reference/subscription-patch
   *
   * TODO: patching does not work, getting subscription Id malformed error
   */
  async patch(
    input: HelcimSubscriptionsPatchInput
  ): Promise<HelcimSubscriptionsPatchOutput> {
    const result = await this.call('', 'PATCH', {
      body: {
        subscriptions: [input],
      },
    });

    return result;
  }

  /**
   * Delete subscription
   *
   * https://devdocs.helcim.com/v2.2/reference/subscription-delete
   */
  async delete(input: HelcimSubscriptionsDeleteInput): Promise<void> {
    const result = await this.call(`/${input.subscriptionId}`, 'DELETE');
    return result;
  }
}
