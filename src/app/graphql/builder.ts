import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import prisma from '~/lib/prisma';
import { type Context, type YogaServerContext } from './context';
import type PrismaTypes from './generated/pothos-types';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: YogaServerContext & Context;
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
    File: { Input: File; Output: never };
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
builder.scalarType('File', {
  serialize: () => {
    throw new Error('Uploads can only be used as input types');
  },
});

builder.queryType();
builder.mutationType();
