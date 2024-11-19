export interface HelcimSubscriptionEntry {
  id: number;
  dateCreated: string;
  dateUpdated: string;
  /**
   * The date (in yyyy-MM-dd format) on which the subscription activates. Any
   * free trial applied to the subscription begins on this date and this date
   * determines when the first recurring billing date occurs.
   */
  dateActivated: string;
  /** The date (in yyyy-MM-dd format) on which the next billing is collected. */
  dateBilling: string;
  /**
   * Current subscription status
   *
   * One of:
   *
   * - Active (billed at `dateBilling`)
   * - Paused (will not be billed at `dateBilling`)
   * - Cancelled (will not be billed at `dateBilling`)
   */
  status: string;
  paymentPlanId: number;
  customerCode: string;
  timesBilled: number;
  recurringAmount: number;
  freeTrialPeriod: number;
  maxCycles: number;
  hasFailedPayments: string;
  addOnIds: number[];
}

export interface HelcimSubscriptionAddonEntry {
  addOnId: number;
  name: string;
  description: string;
  amount: number;
  firstProcessedNumber: number;
  lastProcessedNumber: number;
  isActive: string;
  frequency: string;
  quantity: number;
}

export interface HelcimPaymentEntry {
  id: number;
  setupAmount: number;
  recurringAmount: number;
  addOnAmount: number;
  amount: number;
  taxAmount: number;
  dateDue: string;
  dateProcessed: string;
  status: string;
  paymentNumber: number;
  numberOfRetries: number;
}
