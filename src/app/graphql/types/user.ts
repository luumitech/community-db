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
      const { user } = await ctx;
      const { email } = user;

      // Find the user matching the current logged in user
      let entry = await prisma.user.upsert({
        ...query,
        where: { email },
        // not updating the record if already exists
        update: {},
        // create the user if not already in database
        create: { email },
      });

      // In development mode, add all document accessible under 'devuser@email.com' to
      // the current context user
      // This will ensure that context user see everything that `yarn seed-db` has
      // created for devuser@email.com'
      if (!isProduction()) {
        const accessList = await prisma.access.findMany({
          select: { id: true },
          where: {
            user: {
              email: 'devuser@email.com',
            },
          },
        });
        entry = await prisma.user.update({
          ...query,
          where: { id: entry.id },
          data: {
            accessList: { connect: accessList },
          },
        });
      }

      return entry;
    },
  })
);
