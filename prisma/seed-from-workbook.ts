import { Prisma, PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';

/**
 * Seed database using content from workbook
 *
 * @param workbook Excel workbook
 */
export async function seedFromWorkbook(
  prisma: PrismaClient,
  workbook: XLSX.WorkBook
) {
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
      email: 'test@email.com',
      accessList: {
        create: accessSeed,
      },
    },
  });
}
