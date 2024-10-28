import type { HelcimSubscriptionEntry } from './entry';

/** See: https://devdocs.helcim.com/v2.2/reference/subscription-create */

export interface HelcimSubscriptionsCreateInput {
  /**
   * The date (in yyyy-MM-dd format) on which the subscription activates. Any
   * free trial applied to the subscription begins on this date and this date
   * determines when the first recurring billing date occurs.
   */
  dateActivated: string;
  /** The payment plan id to which the subscription is subscribing to */
  paymentPlanId: number;
  /** The code for the customer who is subscribing to the payment plan */
  customerCode: string;
  /**
   * The recurring amount charged each cycle for the subscription. The value can
   * differ from the payment plan if desired.
   */
  recurringAmount: number;
  /**
   * The method of payment which will be used for processing payments for the
   * subscription. The customer's default method will be used in both cases. The
   * chosen method must be allowed by the payment plan's specified payment
   * method.
   *
   * - `card` - Subscription will be charged using the customer's default credit
   *   card
   * - `bank` - Subscription will be charged using the customer's default bank
   *   account
   */
  paymentMethod: string;
}

export interface HelcimSubscriptionsCreateOutput {
  data: HelcimSubscriptionEntry[];
}
