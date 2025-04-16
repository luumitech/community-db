import path from 'path';
import * as XLSX from 'xlsx';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';
import { TestUtil } from '~/graphql/test-util';
import prisma from '~/lib/prisma';
import { ExportLcra } from '~/lib/xlsx-io/export';
import { CommunityEntry } from '~/lib/xlsx-io/import';
import { importLcraDB } from '~/lib/xlsx-io/import/format-lcradb';

describe('export to xlsx (singlesheet LCRA format)', () => {
  const testUtil = new TestUtil();
  let expectedImportResult: CommunityEntry;

  beforeAll(async () => {
    await testUtil.initialize();
    expectedImportResult = await testUtil.database.seed(
      path.join(process.cwd(), '__fixtures__', 'simple.xlsx')
    );
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('verify export workbook', async () => {
    const community = await prisma.community.findFirstOrThrow({
      include: {
        updatedBy: true,
        propertyList: {
          include: {
            updatedBy: true,
          },
          orderBy: DEFAULT_PROPERTY_ORDER_BY,
        },
      },
    });
    const helper = new ExportLcra(community);
    const xlsxBuf = helper.toXlsx();

    // Compare exported XLSX against original XLSX
    const actualwb = XLSX.read(xlsxBuf);
    const actualImportResult = importLcraDB(actualwb);

    expect(actualImportResult.name).toEqual(expectedImportResult.name);
    expect(actualImportResult.propertyList).toEqual(
      expectedImportResult.propertyList
    );
    expect(actualImportResult.paymentMethodList).toEqual(
      expectedImportResult.paymentMethodList
    );
  });
});
