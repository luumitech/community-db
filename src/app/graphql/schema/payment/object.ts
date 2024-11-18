import { builder } from '~/graphql/builder';

export const paymentTypeRef = builder.enumType('PaymentType', {
  values: {
    NONE: {
      description: 'No payment method stored',
    },
    GRANTED: {
      description: 'No payment method stored, but granted paid priviledge',
    },
    HELCIM: {
      description: 'Payment method stored in Helcim',
    },
  } as const,
});

export const subscriptionStatusRef = builder.enumType('SubscriptionStatus', {
  values: {
    INACTIVE: {
      description: 'No current subscription',
    },
    ACTIVE: {
      description: 'Subscription is current and billed at `dateBilling`',
    },
    CANCELLED: {
      description:
        'Subscription available but will be stopped at `dateBilling`',
    },
  } as const,
});

export interface SubscriptionEntry {
  paymentType: typeof paymentTypeRef.$inferType;
  subscriptionId?: string;
  status: typeof subscriptionStatusRef.$inferType;
  dateActivated: string;
  /** Next billing date */
  dateBilling: string;
  recurringAmount: number;
}

export const subscriptionEntryRef = builder
  .objectRef<SubscriptionEntry>('SubscriptionEntry')
  .implement({
    fields: (t) => ({
      id: t.field({
        type: 'ID',
        resolve: (entry) =>
          `${entry?.paymentType}-${entry.subscriptionId ?? 1}`,
      }),
      paymentType: t.field({
        type: paymentTypeRef,
        resolve: (entry) => entry.paymentType,
      }),
      status: t.field({
        type: subscriptionStatusRef,
        resolve: (entry) => entry.status,
      }),
      dateActivated: t.exposeString('dateActivated'),
      dateBilling: t.exposeString('dateBilling'),
      recurringAmount: t.exposeInt('recurringAmount'),
    }),
  });
