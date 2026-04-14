import { PrismaClient } from '@prisma/client';
import { Agenda } from 'agenda';
import { MongoClient } from 'mongodb';

/**
 * A custom (type-enabled) global object to keep track of app level global
 * variable
 */
export const appGlobal = globalThis as unknown as {
  /** Common mongoClient (for Agenda use currently) */
  mongoClient: MongoClient | undefined;
  agenda: Agenda | undefined;
  /** Prisma manages its own mongo client */
  prisma: PrismaClient | undefined;
};
