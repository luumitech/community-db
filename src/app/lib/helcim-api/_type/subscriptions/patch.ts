import type { HelcimSubscriptionEntry } from './entry';

/** See: https://devdocs.helcim.com/v2.2/reference/subscription-patch */

export interface HelcimSubscriptionsPatchInput {
  /** The id of the subscription */
  id: number;
  /**
   * The subscription activity status. The allowed statuses to apply are
   * indicated below. Note that cancelled and expired subscriptions cannot be
   * made active.
   *
   * - Active - Subscription is active and will bill every cycle
   * - Paused - Subscription is paused and not billing. It can be resumed when
   *   desired.
   * - Cancelled - Subscription is cancelled and not billing. It cannot be
   *   resumed.
   */
  status?: string;
  /**
   * The date (in yyyy-MM-dd format) on which the subscription activates. Any
   * free trial applied to the subscription begins on this date and this date
   * determines when the first recurring billing date occurs.
   */
  dateActivated?: string;
  /**
   * The recurring amount charged each cycle for the subscription. The value can
   * differ from the payment plan if desired.
   */
  recurringAmount?: number;
}

export interface HelcimSubscriptionsPatchOutput {
  data: HelcimSubscriptionEntry[];
}
