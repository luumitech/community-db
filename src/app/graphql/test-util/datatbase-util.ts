import * as XLSX from 'xlsx';
import { MongoSeeder } from '~/../../prisma/mongo-seeder';
import prisma from '~/lib/prisma';
import { WorksheetHelper } from '~/lib/worksheet-helper';

/** Database related utilities for testing purpose */
export class DatabaseUtil {
  /** Drop database (clear all database) */
  async dropDatabase() {
    await prisma.$runCommandRaw({ dropDatabase: 1 });
  }

  /**
   * Seed database with LCRA workbook
   *
   * @param workbook Excel workbook
   * @returns Database entries returned
   */
  async seedFromWorkbook(workbook: XLSX.WorkBook) {
    const seeder = new MongoSeeder(workbook);
    const importResult = await seeder.seed(prisma, 'jest@email.com');

    return importResult;
  }

  /**
   * Seed database with excel file in `fixturePath`
   *
   * @param fixturePath Excel workbook
   * @returns Database entries returned
   */
  async seed(fixturePath: string) {
    const workbook = XLSX.readFile(fixturePath);
    return this.seedFromWorkbook(workbook);
  }

  /**
   * Clone workbook and return it
   *
   * @param workbook Workbook to clone
   */
  cloneWorkbook(workbook: XLSX.WorkBook) {
    const ws = WorksheetHelper.fromFirstSheet(workbook);
    const newWb = XLSX.utils.book_new(ws.ws);
    return newWb;
  }
}
