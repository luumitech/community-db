import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { Logger } from '~/lib/logger';
import prisma from '~/lib/prisma';
import { mailchimpMemberRef, mailchimpSubscriberStatusRef } from './object';
import { getMailchimpApi } from './util';

const logger = Logger('graphql/schema/mailchimp/modify');

export const MailchimpUpdateInput = builder.inputType('MailchimpUpdateInput', {
  fields: (t) => ({
    communityId: t.string({
      description: 'community short ID',
      required: true,
    }),
    listId: t.string({
      description: 'mailchimp audience list ID',
      required: true,
    }),
    memberId: t.string({ required: true }),
  }),
});

const MailchimpMergeFieldsInput = builder.inputType(
  'MailchimpMergeFieldsInput',
  {
    fields: (t) => ({
      FNAME: t.string({
        description: 'first name',
        required: true,
      }),
      LNAME: t.string({
        description: 'last name',
        required: true,
      }),
    }),
  }
);

const MailchimpMemberModifyInput = builder.inputType(
  'MailchimpMemberModifyInput',
  {
    fields: (t) => ({
      self: t.field({ type: MailchimpUpdateInput, required: true }),
      email_address: t.string({ required: true }),
      merge_fields: t.field({
        type: MailchimpMergeFieldsInput,
        required: true,
      }),
      status: t.field({
        description: 'Mailchimp subscriber status',
        type: mailchimpSubscriberStatusRef,
        required: true,
      }),
    }),
  }
);

builder.mutationField('mailchimpMemberModify', (t) =>
  t.field({
    type: mailchimpMemberRef,
    args: {
      input: t.arg({ type: MailchimpMemberModifyInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { self, ...input } = args.input;
      const { communityId, listId, memberId } = self;

      const api = await getMailchimpApi(user, communityId);

      const updatedMember = await api.audience.updateListMember(
        listId,
        memberId,
        input
      );
      return updatedMember;
    },
  })
);
