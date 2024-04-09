import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import prisma from '../lib/prisma';
import { createContext } from './context';
import type PrismaTypes from './generated/pothos-types.ts';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: ReturnType<typeof createContext>;
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma,
  },
});

builder.queryType({});
builder.mutationType({});
