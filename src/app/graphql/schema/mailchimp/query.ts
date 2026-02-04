import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { mailchimpAudienceRef, mailchimpMemberRef } from './object';
import { getMailchimpApi } from './util';

const MailchimpAudienceListInput = builder.inputType(
  'MailchimpAudienceListInput',
  {
    fields: (t) => ({
      communityId: t.string({
        description: 'community short ID',
        required: true,
      }),
    }),
  }
);

builder.queryField('mailchimpAudienceList', (t) =>
  t.field({
    type: [mailchimpAudienceRef],
    args: {
      input: t.arg({ type: MailchimpAudienceListInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { user } = ctx;
      const { communityId } = args.input;
      const shortId = communityId;

      const api = await getMailchimpApi(user, shortId);
      const audienceList = await api.audience.lists(['id', 'name']);

      const result = audienceList.map((entry) => ({
        listId: entry.id,
        name: entry.name,
      }));
      return result;
    },
  })
);

const MailchimpMemberListInput = builder.inputType('MailchimpMemberListInput', {
  fields: (t) => ({
    communityId: t.string({
      description: 'community short ID',
      required: true,
    }),
    listId: t.string({ required: true }),
  }),
});

builder.queryField('mailchimpMemberList', (t) =>
  t.field({
    type: [mailchimpMemberRef],
    args: {
      input: t.arg({ type: MailchimpMemberListInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { user } = ctx;
      const { communityId: shortId, listId } = args.input;

      const api = await getMailchimpApi(user, shortId);

      const memberList = await api.audience.memberLists(listId, [
        'id',
        'email_address',
        'full_name',
        'status',
      ]);
      return memberList;
    },
  })
);
