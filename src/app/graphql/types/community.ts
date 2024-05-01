import { builder } from '../builder';

builder.prismaObject('Community', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: false }),
    userList: t.relation('userList'),
    propertyList: t.relation('propertyList'),
  }),
});

// builder.queryField('userList', (t) =>
//   t.prismaField({
//     type: ['User'],
//     resolve: (query, _parent, _args, _ctx, _info) =>
//       prisma.user.findMany({ ...query }),
//   })
// );

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
