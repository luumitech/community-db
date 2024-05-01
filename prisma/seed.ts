import { PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/import-community';

const prisma = new PrismaClient();

const workbook = XLSX.readFile(path.join(__dirname, 'lcra-db.xlsx'));
const propertyList = importLcraDB(workbook);

const communitySeed = [
  {
    name: 'Test Community1',
    propertyList: {
      create: propertyList,
    },
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
