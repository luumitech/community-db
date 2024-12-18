import * as GQL from '~/graphql/generated/graphql';

/** Subscription Plan information returned from useSubscriptionPlan hook */
export interface SubscriptionPlan {
  /** The information is being loaded */
  isLoading?: boolean;
  paymentType: GQL.PaymentType;
  isActive: boolean;
  recurringAmount: string;
  nextBillingDate?: string;
}
