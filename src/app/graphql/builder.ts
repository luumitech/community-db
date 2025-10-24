import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import {
  DateResolver,
  DateTimeResolver,
  JSONObjectResolver,
} from 'graphql-scalars';
import prisma from '~/lib/prisma';
import { type Context } from './context';
import type PrismaTypes from './generated/pothos-types';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
    JSONObject: { Input: object; Output: object };
  };
  DefaultEdgesNullability: false;
  /** Additional connection fields added */
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
builder.addScalarType('JSONObject', JSONObjectResolver, {});

builder.queryType();
builder.mutationType();
