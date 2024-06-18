import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { isProduction } from '~/lib/env-var';
import prisma from '~/lib/prisma';

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

builder.prismaObject('Access', {
  fields: (t) => ({
    id: t.exposeID('id'),
    role: t.exposeString('role'),
    community: t.relation('community'),
  }),
});
