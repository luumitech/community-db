import type {
  HelcimPaymentEntry,
  HelcimSubscriptionAddonEntry,
  HelcimSubscriptionEntry,
} from './entry';

/** See: https://devdocs.helcim.com/v2.2/reference/subscription-create */

export interface HelcimSubscriptionsGetSingleInput {
  /** The subscription id */
  subscriptionId: number;
  /**
   * Specifies whether to include available sub-objects linked to the
   * subscription. Available sub-objects:
   *
   * -payments tracking the subscription's recurring billing -add-ons applied to
   * the subscription
   */
  includeSubObjects?: boolean;
}

export interface HelcimSubscriptionsGetSingleOutput {
  /**
   * Date API is processed
   *
   * - I.e. `2024-10-10T12:50:42.650550967-06:00`
   */
  timestamp: string;
  /** Is call ok? */
  status: string;
  data: HelcimSubscriptionEntry & {
    addOns?: HelcimSubscriptionAddonEntry[];
    payments?: HelcimPaymentEntry[];
  };
}
