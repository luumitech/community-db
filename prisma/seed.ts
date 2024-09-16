import { PrismaClient } from '@prisma/client';
import { MongoSeeder } from './mongo-seeder';

async function main() {
  const prisma = new PrismaClient();
  try {
    const seeder = MongoSeeder.fromRandom(100);
    await seeder.seed(prisma);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
