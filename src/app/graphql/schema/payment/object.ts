import { builder } from '~/graphql/builder';

export const paymentTypeRef = builder.enumType('PaymentType', {
  values: ['GRANTED', 'HELCIM'] as const,
});

export interface SubscriptionEntry {
  id: string;
  paymentType: typeof paymentTypeRef.$inferType;
  status: string;
  dateActivated: string;
  dateBilling: string;
  recurringAmount: number;
}

export const subscriptionEntryRef = builder
  .objectRef<SubscriptionEntry>('SubscriptionEntry')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      paymentType: t.field({
        type: paymentTypeRef,
        resolve: (entry) => entry.paymentType,
      }),
      status: t.exposeString('status'),
      dateActivated: t.exposeString('dateActivated'),
      dateBilling: t.exposeString('dateBilling'),
      recurringAmount: t.exposeInt('recurringAmount'),
    }),
  });
