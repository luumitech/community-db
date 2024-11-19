/** Subscription Plan information returned from useSubscriptionPlan hook */
export interface SubscriptionPlan {
  isActive: boolean;
  recurringAmount: string;
  nextBillingDate?: string;
}
