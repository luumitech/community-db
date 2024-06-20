import { builder } from '~/graphql/builder';
import prisma from '~/lib/prisma';

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
      const { user } = await ctx;
      const { email } = user;

      const entry = await prisma.community.create({
        ...query,
        data: {
          ...args.input,
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
