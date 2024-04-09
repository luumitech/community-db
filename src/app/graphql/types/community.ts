import { builder } from '../builder';

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: false }),
    userList: t.relation('userList'),
  }),
});

builder.mutationField('communityCreate', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { email } = user;

      return prisma.community.create({
        ...query,
        data: {
          ...args,
          userList: { connect: [{ email }] },
        },
      });
    },
  })
);
