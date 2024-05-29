import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';

const prisma = new PrismaClient();

const workbook = XLSX.readFile(path.join(__dirname, 'lcra-db.xlsx'));
const propertyList = importLcraDB(workbook);

const communitySeed: Prisma.CommunityCreateInput[] = [
  {
    name: 'Test Community1',
    propertyList: {
      create: propertyList,
    },
  },
  {
    name: 'Test Community2',
    propertyList: {
      create: propertyList,
    },
  },
];

const accessSeed: Prisma.AccessCreateWithoutUserInput[] = communitySeed.map(
  (community) => ({
    role: 'ADMIN',
    community: {
      create: community,
    },
  })
);

async function main() {
  await prisma.user.create({
    data: {
      email: 'devuser@email.com',
      accessList: {
        create: accessSeed,
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
