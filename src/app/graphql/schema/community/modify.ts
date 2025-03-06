import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { NameListUtil } from './name-list-util';
import { getCommunityEntry } from './util';

const EmailSettingInput = builder.inputType('EmailSettingInput', {
  fields: (t) => ({
    subject: t.string({ required: true }),
    message: t.string({ required: true }),
  }),
});

const DefaultSettingInput = builder.inputType('DefaultSettingInput', {
  fields: (t) => ({
    membershipFee: t.string(),
    membershipEmail: t.field({ type: EmailSettingInput }),
  }),
});

const EventItemInput = builder.inputType('EventItemInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});
const TicketItemInput = builder.inputType('TicketItemInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    count: t.int(),
    unitPrice: t.string(),
  }),
});
const PaymentMethodInput = builder.inputType('PaymentMethodInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const CommunityModifyInput = builder.inputType('CommunityModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    name: t.string(),
    eventList: t.field({ type: [EventItemInput] }),
    ticketList: t.field({ type: [TicketItemInput] }),
    paymentMethodList: t.field({ type: [PaymentMethodInput] }),
    defaultSetting: t.field({ type: DefaultSettingInput }),
  }),
});

builder.mutationField('communityModify', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { self, ...input } = args.input;
      const shortId = self.id;
      const entry = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          eventList: true,
          ticketList: true,
          paymentMethodList: true,
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${shortId}, please refresh browser.`
        );
      }

      // Make sure user has permission to modify
      await verifyAccess(user, { id: entry.id }, [Role.ADMIN, Role.EDITOR]);

      const {
        name,
        eventList,
        ticketList,
        paymentMethodList,
        ...optionalInput
      } = input;

      const nameListUtil = await NameListUtil.fromDB(entry.id);

      const community = await prisma.community.update({
        ...query,
        where: {
          id: entry.id,
        },
        data: {
          updatedBy: { connect: { email: user.email } },
          // non-nullable fields needs to be specified explicitly
          ...(!!name && { name }),
          // If eventList is provided, make sure eventList contains
          // every event used within the community database
          ...(!!eventList && {
            eventList: nameListUtil.getCompleteEventList(eventList),
          }),
          ...(!!ticketList && {
            ticketList: nameListUtil.getCompleteTicketList(ticketList),
          }),
          // If paymentMethodList is provided, make sure paymentMethodList contains
          // every payment method used within the community database
          ...(!!paymentMethodList && {
            paymentMethodList:
              nameListUtil.getCompletePaymentMethodList(paymentMethodList),
          }),
          ...optionalInput,
        },
      });

      // broadcast modification to community
      pubSub.publish(`community/${shortId}/`, {
        broadcasterId: user.email,
        messageType: MessageType.UPDATED,
        community,
      });

      return community;
    },
  })
);
