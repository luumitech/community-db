import { PrismaClient } from '@prisma/client';
import { MongoSeeder } from '../../prisma/mongo-seeder';

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
  const prisma = new PrismaClient();
  try {
    const seeder = MongoSeeder.fromXlsx(fixture);
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await seeder.seed(prisma);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  return true;
}

export async function mongodbSeedRandom(count: number) {
  const prisma = new PrismaClient();
  try {
    const seeder = MongoSeeder.fromRandom(count);
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await seeder.seed(prisma);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  return true;
}
