/** This is for server use only */
import { PrismaClient } from '@prisma/client';
import { appGlobal } from '~/lib/global';

/**
 * Prisma will be attached to the global object so that you do not exhaust the
 * database connection limit. For more details, check out the documentation for
 * Next.js and Prisma Client best practices:
 *
 * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */
const prisma = appGlobal.prisma ?? new PrismaClient();
appGlobal.prisma ??= prisma;

export default prisma;
