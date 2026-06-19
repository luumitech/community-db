import * as GQL from '~/graphql/generated/types';

/** Subscription Plan information returned from useSubscriptionPlan hook */
export interface SubscriptionPlan {
  /** The information is being loaded */
  isLoading?: boolean;
  paymentType: GQL.PaymentType;
  isActive: boolean;
  recurringAmount: string;
  nextBillingDate?: string;
}
