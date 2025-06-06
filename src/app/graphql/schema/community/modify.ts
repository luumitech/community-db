import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import { Cipher } from '~/lib/cipher';
import { Logger } from '~/lib/logger';
import { MailchimpApi } from '~/lib/mailchimp';
import { isNonEmpty } from '~/lib/obj-util';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { NameListUtil } from './name-list-util';
import { getCommunityEntry } from './util';

const logger = Logger('graphql/schema/community/modify');

const EmailSettingInput = builder.inputType('EmailSettingInput', {
  fields: (t) => ({
    subject: t.string({ required: true }),
    cc: t.stringList({ required: true }),
    message: t.string({ required: true }),
  }),
});

const DefaultSettingInput = builder.inputType('DefaultSettingInput', {
  fields: (t) => ({
    membershipFee: t.string(),
    membershipEmail: t.field({ type: EmailSettingInput }),
  }),
});

const MailchimpSettingInput = builder.inputType('MailchimpSettingInput', {
  fields: (t) => ({
    apiKey: t.string(),
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
    mailchimpSetting: t.field({ type: MailchimpSettingInput }),
  }),
});

builder.mutationField('communityModify', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { self, ...input } = args.input;
      const shortId = self.id;
      const entry = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
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
        defaultSetting,
        mailchimpSetting,
        ...optionalInput
      } = input;

      const nameListUtil = await NameListUtil.fromDB(entry.id);

      // Encrypt any fields that needs to be encrypted
      if (mailchimpSetting?.apiKey) {
        try {
          const api = MailchimpApi.fromApiKey(mailchimpSetting.apiKey);
          await api.ping.ping();
        } catch (err) {
          logger.error(err);
          throw new GraphQLError('Invalid API key');
        }

        const cipher = Cipher.fromConfig();
        mailchimpSetting.apiKey = cipher.encrypt(mailchimpSetting.apiKey);
      }

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
          // defaultSetting is a composite type, we want to to be able to modify
          // individual properties without overriding the entire structure
          // See: https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/composite-types#changing-composite-types-within-update-and-updatemany
          ...(isNonEmpty(defaultSetting) && {
            defaultSetting: {
              upsert: { set: defaultSetting, update: defaultSetting },
            },
          }),
          ...(isNonEmpty(mailchimpSetting) && {
            mailchimpSetting: {
              upsert: { set: mailchimpSetting, update: mailchimpSetting },
            },
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
