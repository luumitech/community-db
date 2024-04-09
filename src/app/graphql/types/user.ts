import { isProduction } from '../../lib/env-var';
import { builder } from '../builder';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    role: t.expose('role', { type: Role }),
    communityList: t.relation('communityList'),
  }),
});

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

builder.queryField('userCurrent', (t) =>
  t.prismaField({
    type: 'User',
    resolve: async (query, _parent, _args, ctx, _info) => {
      const { user } = await ctx;
      const { email } = user;

      let entry = await prisma.user.findUnique({
        ...query,
        where: { email },
        include: {
          communityList: true,
        },
      });
      if (!entry) {
        // In development mode automatically connect communities
        // for `devuser@email.com` to the current context
        if (!isProduction()) {
          const devCommunityList = await prisma.community.findMany({
            select: {
              id: true,
            },
            where: {
              userList: {
                every: {
                  email: 'devuser@email.com',
                },
              },
            },
          });
          entry = await prisma.user.create({
            data: {
              email,
              role: 'ADMIN',
              communityList: {
                connect: devCommunityList,
              },
            },
            include: {
              communityList: true,
            },
          });
        }
      }

      if (!entry) {
        throw new Error('should add new user entry in database');
      }
      return entry;
    },
  })
);

// builder.queryField('userList', (t) =>
//   t.prismaField({
//     type: ['User'],
//     resolve: (query, _parent, _args, _ctx, _info) =>
//       prisma.user.findMany({ ...query }),
//   })
// );
