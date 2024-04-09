import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const communitySeed = [
  {
    name: 'Test Community1',
  },
  {
    name: 'Test Community2',
  },
];

async function main() {
  await prisma.user.create({
    data: {
      email: 'devuser@email.com',
      role: 'ADMIN',
      communityList: {
        create: communitySeed,
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
