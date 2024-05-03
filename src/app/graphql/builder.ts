import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import prisma from '../lib/prisma';
import { createContext } from './context';
import type PrismaTypes from './generated/pothos-types.ts';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: ReturnType<typeof createContext>;
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  DefaultEdgesNullability: false;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {
    cursorType: 'String',
    edgesFieldOptions: {
      nullable: false,
    },
  },
  prisma: {
    client: prisma,
  },
});

builder.addScalarType('Date', DateResolver, {});
builder.addScalarType('DateTime', DateTimeResolver, {});
builder.queryType({});
builder.mutationType({});
