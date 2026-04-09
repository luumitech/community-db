import { Prisma, PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { importXlsx } from '~/lib/xlsx-io/import';
import { seedCommunityData } from '~/lib/xlsx-io/random-seed';

export class MongoSeeder {
  private authUser: Prisma.AuthUserCreateInput;

  constructor(private workbook: XLSX.WorkBook) {
    const { AUTH_TEST_EMAIL } = process.env;
    if (!AUTH_TEST_EMAIL) {
      throw new Error(
        'AUTH_TEST_EMAIL must be set in the environment variables'
      );
    }
    this.authUser = {
      email: AUTH_TEST_EMAIL,
      emailVerified: true,
    };
  }

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
    const wsHelper = WorksheetHelper.fromJson(seedJson, 'fromRandom');
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
   * @param communityName Community name (optional, default to name specified in
   *   workbook)
   */
  async seed(prisma: PrismaClient, communityName?: string) {
    const communityCreateInput = importXlsx(this.workbook);

    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        owner: {
          connect: {
            email: this.authUser.email,
          },
        },
        ...communityCreateInput,
        /** Override community name, if provided */
        ...(communityName != null && { name: communityName }),
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
        email: this.authUser.email,
        accessList: {
          create: accessSeed,
        },
      },
    });

    return communityCreateInput;
  }
}
