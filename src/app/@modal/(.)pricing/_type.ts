/** Subscription Plan information returned from useSubscriptionPlan hook */
export interface SubscriptionPlan {
  isActive: boolean;
  recurringAmount: string;
  nextBillingDate?: string;
}

/** Available subscription plan type */
export type PlanT = 'free' | 'premium' | 'none';
