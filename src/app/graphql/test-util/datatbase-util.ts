import { Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

/** Database related utilities for testing purpose */
export class DatabaseUtil {
  /** Drop database (clear all database) */
  async dropDatabase() {
    await prisma.$runCommandRaw({ dropDatabase: 1 });
  }

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

    const ownerEmail = 'jest@email.com';
    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        name: 'Serenity',
        owner: {
          connect: {
            email: ownerEmail,
          },
        },
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
        email: ownerEmail,
        accessList: {
          create: accessSeed,
        },
      },
    });

    return importResult;
  }
}
