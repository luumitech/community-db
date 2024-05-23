import { GraphQLError } from 'graphql';
import { isProduction } from '../../lib/env-var';
import prisma from '../../lib/prisma';
import { builder } from '../builder';

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
