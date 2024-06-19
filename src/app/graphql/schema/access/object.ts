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
    role: t.exposeString('role'),
    user: t.relation('user'),
    community: t.relation('community'),
  }),
});
