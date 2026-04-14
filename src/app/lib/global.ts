import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

/**
 * A custom (type-enabled) global object to keep track of app level global
 * variable
 */
export const appGlobal = globalThis as unknown as {
  /** Mongo Client created for Agenda task manager */
  mongoClient: MongoClient | undefined;
  prisma: PrismaClient | undefined;
};
