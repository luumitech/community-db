import { PrismaClient } from '@prisma/client';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { seedFromWorkbook } from './seed-from-workbook';

function generateWorkbook() {
  // Randomly create a workbook containing address with membership info
  const seedJson = seedCommunityData(100);
  const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
  return wsHelper.wb;
}

async function main() {
  const prisma = new PrismaClient();
  const workbook = generateWorkbook();
  try {
    await seedFromWorkbook(prisma, workbook);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
