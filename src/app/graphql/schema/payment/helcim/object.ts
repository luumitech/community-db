import { randomUUID } from 'crypto';
import { builder } from '~/graphql/builder';
import type {
  HelcimPayInitializeOutput,
  HelcimSubscriptionEntry,
} from '~/lib/helcim-api/_type';

export const helcimPayInitializeOutputRef = builder
  .objectRef<HelcimPayInitializeOutput>('HelcimPayInitializeOutput')
  .implement({
    fields: (t) => ({
      checkoutToken: t.exposeString('checkoutToken', {
        description:
          'The checkoutToken is the key to displaying the HelcimPay.js modal using the appendHelcimIframe function',
      }),
      /**
       * You can submit any alphanumeric value for your idempotency key, but
       * they need to be 25 characters long and must be unique. The generation
       * and tracking of idempotency keys used for transactions will remain the
       * merchants responsibility.
       *
       * See: https://devdocs.helcim.com/docs/idempotency-keys-for-payments
       */
      idempotentKey: t.string({
        description: 'idempotency key for preventing duplicate transaction',
        resolve: () => {
          return randomUUID().slice(0, 25);
        },
      }),
      /** Secret token is used to verify HelcimPay.js returned payload */
      secretToken: t.exposeString('secretToken'),
      ipAddress: t.string({
        description: 'client IP address',
        resolve: async (_parent, args, ctx) => {
          const { clientIp } = await ctx;
          return clientIp;
        },
      }),
    }),
  });

export const helcimSubscriptionEntryRef = builder
  .objectRef<HelcimSubscriptionEntry>('HelcimSubscriptionEntry')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      status: t.exposeString('status'),
      dateActivated: t.exposeString('dateActivated'),
      dateBilling: t.exposeString('dateBilling'),
      recurringAmount: t.exposeInt('recurringAmount'),
    }),
  });
