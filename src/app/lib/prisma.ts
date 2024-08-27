/** This is for server use only */
import { PrismaClient } from '@prisma/client';
import { isProduction } from './env-var';

let prisma: PrismaClient;

if (isProduction()) {
  prisma = new PrismaClient();
} else {
  /**
   * Prisma will be attached to the global object so that you do not exhaust the
   * database connection limit. For more details, check out the documentation
   * for Next.js and Prisma Client best practices:
   *
   * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
   */
  // @ts-expect-error: don't want to introduce prisma to global type
  if (!global.prisma) {
    // @ts-expect-error: don't want to introduce prisma to global type
    global.prisma = new PrismaClient();
  }
  // @ts-expect-error: don't want to introduce prisma to global type
  prisma = global.prisma;
}
export default prisma;
