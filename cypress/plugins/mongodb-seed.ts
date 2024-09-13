import { PrismaClient } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { seedFromWorkbook } from '../../prisma/seed-from-workbook';

function generateWorkbook(fixture: string) {
  const fixturePath = path.join(process.cwd(), '__fixtures__', fixture);
  const workbook = XLSX.readFile(fixturePath);
  return workbook;
}

/**
 * Seed Mongo database with fixture located in the `/__fixtures__` directory
 *
 * @param fixture Filename of fixture to load in `/__fixtures__` directory, for
 *   example
 *
 *   ```js
 *   cy.task('mongodb:seed', path.join('simple.xlsx'));
 *   ```
 * @returns True if successful
 */
export async function mongodbSeed(fixture: string) {
  const prisma = new PrismaClient();
  const workbook = generateWorkbook(fixture);
  try {
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    await seedFromWorkbook(prisma, workbook);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  return true;
}
