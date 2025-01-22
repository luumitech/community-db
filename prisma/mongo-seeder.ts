import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { importLcraDB } from '~/lib/lcra-community/import';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import { WorksheetHelper } from '~/lib/worksheet-helper';

export class MongoSeeder {
  constructor(private workbook: XLSX.WorkBook) {}

  /**
   * Seed Mongo database with fixture located in the `/__fixtures__` directory
   *
   * @param fixture Filename of fixture to load in `/__fixtures__` directory
   */
  static fromXlsx(fixture: string) {
    const fixturePath = path.join(process.cwd(), '__fixtures__', fixture);
    const workbook = XLSX.readFile(fixturePath);
    return new MongoSeeder(workbook);
  }

  /**
   * Seed Mongo database with randomly generated information
   *
   * @param count Number of properties to generate for the community
   */
  static fromRandom(count = 100) {
    // Randomly create a workbook containing address with membership info
    const seedJson = seedCommunityData(count);
    const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
    return new MongoSeeder(wsHelper.wb);
  }

  /**
   * Seed mongo database using content from workbook This seeder does not clear
   * the database content before seeding, if you want to clear the database
   * content:
   *
   * ```js
   * await prisma.$runCommandRaw({ dropDatabase: 1 });
   * ```
   *
   * @param prisma Prisma instance
   * @param ownerEmail Email creating the community
   */
  async seed(prisma: PrismaClient, ownerEmail = 'test@email.com') {
    const importResult = importLcraDB(this.workbook);
    const { propertyList, ...others } = importResult;

    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        name: 'My Community',
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
