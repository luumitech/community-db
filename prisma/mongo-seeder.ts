import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { importXlsx } from '~/lib/xlsx-io/import';
import { seedCommunityData } from '~/lib/xlsx-io/random-seed';

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
    const wsHelper = WorksheetHelper.fromJson(seedJson, 'Sample Community');
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
    const communityCreateInput = importXlsx(this.workbook);

    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        /**
         * Assign default name to community, but this value would most likely be
         * overridden by tthe imported result
         */
        name: 'CommunityName',
        owner: {
          connect: {
            email: ownerEmail,
          },
        },
        ...communityCreateInput,
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

    return communityCreateInput;
  }
}
