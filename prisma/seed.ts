import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';

function generateWorkbook() {
  // const workbook = XLSX.readFile(
  //   path.join(
  //     __dirname,
  //     '..',
  //     'src',
  //     'app',
  //     'lib',
  //     'lcra-community',
  //     '__tests__',
  //     'lcra-db.xlsx'
  //   )
  // );

  // Randomly create a workbook containing address with membership info
  const seedJson = seedCommunityData(100);
  const worksheet = XLSX.utils.json_to_sheet(seedJson);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'LCRA membership');

  return workbook;
}

const prisma = new PrismaClient();

async function main() {
  const workbook = generateWorkbook();
  const { eventList, propertyList } = importLcraDB(workbook);

  const communitySeed: Prisma.CommunityCreateInput[] = [
    {
      name: 'Test Community',
      eventList,
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
