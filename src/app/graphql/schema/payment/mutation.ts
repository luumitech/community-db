import { builder } from '~/graphql/builder';
import { HelcimApi } from '~/lib/helcim-api';
import {
  helcimPayInitializeOutputRef,
  helcimPurchaseOutputRef,
} from './object';

const HelcimPayInitializeInput = builder.inputType('HelcimPayInitializeInput', {
  fields: (t) => ({
    paymentType: t.string({ required: true }),
    amount: t.float({ required: true }),
    currency: t.string({ required: true }),
  }),
});

builder.mutationField('helcimPayInitialize', (t) =>
  t.field({
    type: helcimPayInitializeOutputRef,
    args: {
      input: t.arg({ type: HelcimPayInitializeInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { paymentType, amount, currency } = args.input;
      const api = await HelcimApi.fromConfig();
      const result = await api.helcimPay.initialize({
        paymentType,
        amount,
        currency,
      });
      return result;
    },
  })
);

interface HelcimPurchaseInput {
  ipAddress: string;
  cardToken: string;
  idempotentKey: string;
}

const HelcimPurchaseInputRef = builder
  .inputRef<HelcimPurchaseInput>('HelcimPurchaseInput')
  .implement({
    fields: (t) => ({
      ipAddress: t.string({ required: true }),
      cardToken: t.string({ required: true }),
      idempotentKey: t.string({ required: true }),
    }),
  });

builder.mutationField('helcimPurchase', (t) =>
  t.field({
    type: helcimPurchaseOutputRef,
    args: {
      input: t.arg({
        type: HelcimPurchaseInputRef,
        required: true,
      }),
    },
    resolve: async (parent, args, ctx) => {
      const { ipAddress, cardToken, idempotentKey } = args.input;

      // Process subscription payment
      const api = await HelcimApi.fromConfig();
      const result = await api.payment.purchase(
        {
          ipAddress,
          currency: 'CAD',
          amount: 5.99,
          cardData: {
            cardToken,
          },
        },
        idempotentKey
      );

      return result;
    },
  })
);
