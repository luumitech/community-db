import { Prisma } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { TestUtil } from '~/graphql/test-util';
import { ExportHelper } from '~/lib/lcra-community/export';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

describe('export community xlsx', () => {
  const testUtil = new TestUtil();
  const ctx = {
    uid: '001',
    email: 'jest@email.com',
  };
  let expectedImportResult: ReturnType<typeof importLcraDB>;

  beforeAll(async () => {
    await testUtil.initialize();

    const workbook = XLSX.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'prisma',
        'lcra-db.xlsx'
      )
    );

    expectedImportResult = importLcraDB(workbook);
    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        name: 'Test Community',
        eventList: expectedImportResult.eventList,
        propertyList: {
          create: expectedImportResult.propertyList,
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
        ...ctx,
        accessList: {
          create: accessSeed,
        },
      },
    });
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('verify export workbook', async () => {
    const community = await prisma.community.findFirst({
      include: {
        propertyList: true,
      },
    });
    const helper = new ExportHelper(community!.propertyList);
    const xlsxBuf = helper.toXlsx();

    // Compare exported XLSX against original XLSX
    const actualwb = XLSX.read(xlsxBuf);
    const { propertyList } = importLcraDB(actualwb);

    expect(propertyList).toEqual(expectedImportResult.propertyList);
  });
});
