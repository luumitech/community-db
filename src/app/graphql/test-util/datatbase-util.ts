import { Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

/** Database related utilities for testing purpose */
export class DatabaseUtil {
  /**
   * Seed database with excel file in `fixturePath`
   *
   * @param fixturePath Excel workbook
   * @returns Database entries returned
   */
  async seed(fixturePath: string) {
    const workbook = XLSX.readFile(fixturePath);
    const importResult = importLcraDB(workbook);
    const { propertyList, ...others } = importResult;
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
        email: 'jest@email.com',
        accessList: {
          create: accessSeed,
        },
      },
    });

    return importResult;
  }
}
