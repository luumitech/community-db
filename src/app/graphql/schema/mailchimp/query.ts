import type { Occupant, Property } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { getCommunityEntry } from '../community/util';
import { propertyListFindManyArgs } from '../property/util';
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

      // return [{ name: 'LuumiTech Consulting Inc.', listId: '9e1f03ec3e' }];
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
        'email_address',
        'full_name',
        'status',
      ]);

      const result = memberList.map((entry) => ({
        email: entry.email_address,
        fullName: entry.full_name,
        status: entry.status,
      }));

      const community = await getCommunityEntry(user, shortId);
      const findManyArgs = await propertyListFindManyArgs(community.id, null);
      const propertyList = await prisma.property.findMany({
        ...findManyArgs,
      });

      const occupantMap = new Map<string, [Property, number]>();
      propertyList.forEach((entry) => {
        entry.occupantList.forEach((occupant, occupantIdx) => {
          if (occupant.email) {
            occupantMap.set(occupant.email, [entry, occupantIdx]);
          }
        });
      });

      return result.map((item) => {
        const occupant = occupantMap.get(item.email);
        return {
          ...item,
          property: occupant != null ? occupant[0] : null,
        };
      });
    },
  })
);
