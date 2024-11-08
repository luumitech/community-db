import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { userRef } from '~/graphql/schema/user/object';
import { getUserEntry } from '~/graphql/schema/user/util';
import { formatAsDate } from '~/lib/date-util';
import { env } from '~/lib/env-cfg';
import { HelcimApi } from '~/lib/helcim-api';
import prisma from '~/lib/prisma';
import { getSubscriptionEntry } from '../util';
import { helcimPayInitializeOutputRef } from './object';

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
      const userDoc = await getUserEntry(user);
      const existingSub = await getSubscriptionEntry(userDoc);
      if (existingSub != null) {
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
    type: userRef,
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
      const existingSub = await getSubscriptionEntry(userDoc);
      if (existingSub != null) {
        throw new GraphQLError('You have already paid for a subscription');
      }

      // Process subscription payment
      const api = await HelcimApi.fromConfig();
      const subResult = await api.subscriptions.create(
        {
          customerCode,
          dateActivated: formatAsDate(new Date(Date.now())),
          paymentPlanId: env.PAYMENT_HELCIM_PLAN_ID,
          recurringAmount: env.NEXT_PUBLIC_PLAN_COST,
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
        data: {
          subscription: {
            paymentType: 'HELCIM',
            subscriptionId: subEntry.id.toString(),
          },
        },
      });

      return userEntry;
    },
  })
);

builder.mutationField('helcimCancelSubscription', (t) =>
  t.field({
    type: userRef,
    resolve: async (parent, args, ctx) => {
      const { user } = await ctx;

      // Check if user has an ongoing subscription already
      const userDoc = await getUserEntry(user);
      const existingSub = await getSubscriptionEntry(userDoc);
      const subscriptionIdStr = userDoc.subscription?.subscriptionId;
      if (!subscriptionIdStr || existingSub == null) {
        throw new GraphQLError('You do not have a subscription');
      }
      const subscriptionId = parseInt(subscriptionIdStr, 10);

      // Process subscription payment
      const api = await HelcimApi.fromConfig();

      // TODO: patch doesn't work, so we remove the subscription directly
      // const subResult = await api.subscriptions.patch({
      //   id: subscriptionId,
      //   status: 'cancelled',
      // });

      // const subEntry = subResult.data[0];
      // if (!subEntry?.id) {
      //   throw new GraphQLError('Cancelling subscription plan failed');
      // }

      const deleteResult = await api.subscriptions.delete({ subscriptionId });

      return {
        ...userDoc,
        // Subscription removed
        subscription: null,
      };
    },
  })
);
