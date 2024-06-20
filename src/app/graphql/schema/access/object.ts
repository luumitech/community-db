import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { isProduction } from '~/lib/env-var';
import prisma from '~/lib/prisma';

export const roleRef = builder.enumType('Role', {
  values: ['ADMIN', 'EDITOR', 'VIEWER'] as const,
});

builder.prismaObject('Access', {
  fields: (t) => ({
    id: t.exposeID('id'),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    role: t.field({
      type: roleRef,
      resolve: (entry) => entry.role,
    }),
    user: t.relation('user'),
    community: t.relation('community'),
  }),
});
