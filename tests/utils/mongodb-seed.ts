import { MongoSeeder } from '../../prisma/mongo-seeder';
import prisma from '../../src/app/lib/prisma';

export const SAMPLE_COMMUNITY = 'Sample Community';

/**
 * Seed Mongo database with fixture located in the `/__fixtures__` directory
 *
 * @param fixture Filename of fixture to load in `/__fixtures__` directory, for
 *   example
 *
 *   ```js
 *   cy.task('mongodb:seed', path.join('simple-lcra.xlsx'));
 *   ```
 * @returns True if successful
 */
export async function mongodbSeedFromFixture(fixture: string) {
  try {
    const seeder = MongoSeeder.fromXlsx(fixture);
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await seeder.seed(prisma, SAMPLE_COMMUNITY);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  return true;
}

export async function mongodbSeedRandom(count: number) {
  try {
    const seeder = MongoSeeder.fromRandom(count);
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await seeder.seed(prisma, SAMPLE_COMMUNITY);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  return true;
}
