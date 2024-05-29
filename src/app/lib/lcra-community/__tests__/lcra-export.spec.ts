import { Prisma } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { TestUtil } from '~/graphql/test-util';
import { ExportHelper } from '~/lib/lcra-community/export';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

describe('export community xlsx', () => {
  const testUtil = new TestUtil();
  const ctxEmail = 'jest@email.com';
  let expectedPropertyList: ReturnType<typeof importLcraDB>;

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

    expectedPropertyList = importLcraDB(workbook);
    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        name: 'Test Community',
        propertyList: {
          create: expectedPropertyList,
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
        email: ctxEmail,
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
    const actualPropertyList = importLcraDB(actualwb);

    expect(actualPropertyList).toEqual(expectedPropertyList);
  });
});
