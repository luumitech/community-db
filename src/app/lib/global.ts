import { PrismaClient } from '@prisma/client';
import { Agenda } from 'agenda';

/**
 * A custom (type-enabled) global object to keep track of app level global
 * variable
 */
export const appGlobal = globalThis as unknown as {
  agenda: Agenda | undefined;
  prisma: PrismaClient | undefined;
};
