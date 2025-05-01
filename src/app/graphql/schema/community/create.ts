import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { getSubscriptionEntry } from '../payment/util';
import { getUserEntry } from '../user/util';

const CommunityCreateInput = builder.inputType('CommunityCreateInput', {
  fields: (t) => ({
    name: t.string({ description: 'Community name', required: true }),
  }),
});

builder.mutationField('communityCreate', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityCreateInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = ctx;
      const { email } = user;
      const userDoc = await getUserEntry(user);
      const existingSub = await getSubscriptionEntry(userDoc);
      const { communityLimit } = existingSub;

      /** Check if context user has reached community limits creation limit */
      if (communityLimit != null) {
        //
        const communityCount = await prisma.community.count({
          where: { owner: { email } },
        });
        if (communityCount >= communityLimit) {
          throw new GraphQLError(
            `You can create at most ${communityLimit} communities.`
          );
        }
      }

      const entry = await prisma.community.create({
        ...query,
        data: {
          ...args.input,
          owner: {
            connect: { email },
          },
          accessList: {
            create: {
              role: 'ADMIN',
              user: { connect: { email } },
            },
          },
        },
      });
      return entry;
    },
  })
);
