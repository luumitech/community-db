import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { getUserEntry } from '~/graphql/schema/user/util';
import { env } from '~/lib/env-cfg';
import { HelcimApi } from '~/lib/helcim-api';
import prisma from '~/lib/prisma';
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
      const { user } = await ctx;
      const { paymentType, amount, currency } = args.input;

      // Check if user has an ongoing subscription already
      const userEntry = await getUserEntry(user);
      if (userEntry.subscriptionId != null) {
        throw new GraphQLError('You have already paid for a subscription');
      }

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
  customerCode: string;
  idempotentKey: string;
}

const HelcimPurchaseInputRef = builder
  .inputRef<HelcimPurchaseInput>('HelcimPurchaseInput')
  .implement({
    fields: (t) => ({
      ipAddress: t.string({ required: true }),
      cardToken: t.string({ required: true }),
      customerCode: t.string({ required: true }),
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
      const { user } = await ctx;
      const { customerCode, idempotentKey } = args.input;

      // Check if user has an ongoing subscription already
      const userDoc = await getUserEntry(user);
      if (userDoc.subscriptionId != null) {
        throw new GraphQLError('You have already paid for a subscription');
      }

      // Process subscription payment
      const api = await HelcimApi.fromConfig();
      const subResult = await api.subscriptions.create(
        {
          customerCode,
          dateActivated: '2024-10-10',
          paymentPlanId: env().payment.helcim.planId,
          recurringAmount: env().nextPublic.plan.cost,
          paymentMethod: 'card',
        },
        idempotentKey
      );

      const subEntry = subResult.data[0];
      if (!subEntry?.id) {
        throw new GraphQLError(
          'Registering payment in subscription plan failed'
        );
      }

      // Record subscription plan ID into user document
      const userEntry = await prisma.user.update({
        where: { id: userDoc.id },
        data: { subscriptionId: subEntry.id },
      });

      return {
        subscription: subEntry,
        user: userEntry,
      };
    },
  })
);
