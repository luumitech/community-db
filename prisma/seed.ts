import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import { WorksheetHelper } from '~/lib/worksheet-helper';

function generateWorkbook() {
  // const workbook = XLSX.readFile(
  //   path.join(process.cwd(), '__fixtures__', 'lcra-db.xlsx')
  // );
  // return workbook;

  // Randomly create a workbook containing address with membership info
  const seedJson = seedCommunityData(100);
  const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
  return wsHelper.wb;
}

const prisma = new PrismaClient();

async function main() {
  const workbook = generateWorkbook();
  const { propertyList, ...others } = importLcraDB(workbook);

  const communitySeed: Prisma.CommunityCreateInput[] = [
    {
      name: 'Test Community',
      ...others,
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
