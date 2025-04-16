import { Prisma } from '@prisma/client';

export const JEST_USER: Prisma.UserCreateInput = {
  email: 'jest@email.com',
  name: 'jest tester',
};
