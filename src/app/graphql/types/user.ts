import { GraphQLError } from 'graphql';
import { isProduction } from '../../lib/env-var';
import prisma from '../../lib/prisma';
import { builder } from '../builder';

// const Preference = builder.objectRef<Preference>('Preference').implement({
//   fields: (t) => ({
//     theme: t.exposeString('theme'),
//   }),
// });

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    accessList: t.relation('accessList'),
    // preference: t.field({
    //   type: Preference,
    //   select: { preference: true },
    //   resolve: (entry) => entry.preference,
    // }),
  }),
});

builder.queryField('userCurrent', (t) =>
  t.prismaField({
    type: 'User',
    resolve: async (query, parent, args, ctx, info) => {
      const {
        // Only image is not saved in user document
        user: { image, ...user },
      } = await ctx;

      // Find the user matching the current logged in user
      let userEntry = await prisma.user.upsert({
        ...query,
        where: { uid: user.uid },
        // not updating the record if already exists
        update: {},
        // create the user if not already in database
        create: user,
      });

      // In development mode, if context user does not have access
      // to any community, then add all document accessible under
      // 'devuser@email.com' to the current context user
      // This will ensure that context user see everything that `yarn seed-db` has
      // created for devuser@email.com'
      if (!isProduction()) {
        const ownAccess = await prisma.access.findFirst({
          select: { id: true },
          where: { user: { uid: user.uid } },
        });
        if (ownAccess == null) {
          const devAccessList = await prisma.access.findMany({
            where: { user: { email: 'devuser@email.com' } },
          });
          // clone devAccessList to context user
          const ownAccessLists = await Promise.all(
            devAccessList.map(async (devAccess) =>
              prisma.access.create({
                data: {
                  role: 'ADMIN',
                  userId: userEntry.id,
                  communityId: devAccess.communityId,
                },
              })
            )
          );
          userEntry = await prisma.user.update({
            ...query,
            where: { id: userEntry.id },
            data: {
              accessList: { connect: ownAccessLists },
            },
          });
        }
      }

      return userEntry;
    },
  })
);
