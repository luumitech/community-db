import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';
import { ObjectId } from 'mongodb';
import path from 'path';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { importXlsx } from '~/lib/xlsx-io/import';
import { seedCommunityData } from '~/lib/xlsx-io/random-seed';

// Community will be owned by this user
interface CommunityOwner {
  email: string;
  password: string;
}

export class MongoSeeder {
  private owner: CommunityOwner;

  constructor(private workbook: XLSX.WorkBook) {
    const { AUTH_TEST_EMAIL, AUTH_TEST_PASSWORD } = process.env;
    if (!AUTH_TEST_EMAIL) {
      throw new Error(
        'AUTH_TEST_EMAIL must be set in the environment variables'
      );
    }
    if (!AUTH_TEST_PASSWORD) {
      throw new Error(
        'AUTH_TEST_PASSWORD must be set in the environment variables'
      );
    }
    this.owner = {
      email: AUTH_TEST_EMAIL,
      password: AUTH_TEST_PASSWORD,
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
   * @param owner Owner information for creating this community
   */
  async seed(prisma: PrismaClient) {
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
            email: this.owner.email,
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

    // better-auth account, so user can be logged in via email/password
    // credential
    const accountSeed: Prisma.AccountCreateWithoutUserInput[] = [
      {
        accountId: new ObjectId().toHexString(),
        providerId: 'credential',
        password: await hashPassword(this.owner.password),
      },
    ];

    await prisma.user.create({
      data: {
        email: this.owner.email,
        accessList: {
          create: accessSeed,
        },
        accountList: {
          create: accountSeed,
        },
      },
    });

    return communityCreateInput;
  }
}
