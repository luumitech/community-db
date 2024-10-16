export interface HelcimSubscriptionEntry {
  id: number;
  dateCreated: string;
  dateUpdated: string;
  dateActivated: string;
  dateBilling: string;
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
