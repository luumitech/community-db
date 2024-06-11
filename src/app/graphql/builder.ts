import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import prisma from '../lib/prisma';
import { createContext } from './context';
import type PrismaTypes from './generated/pothos-types';
import { pubSub } from './pubsub';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: ReturnType<typeof createContext>;
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  DefaultEdgesNullability: false;
  /**
   * Additional connection fields added
   */
  Connection: {
    totalCount: number;
  };
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
builder.queryType();
builder.mutationType();
// builder.subscriptionType({});
