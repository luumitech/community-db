import path from 'path';
import * as XLSX from 'xlsx';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';
import { TestUtil } from '~/graphql/test-util';
import prisma from '~/lib/prisma';
import { ExportMultisheet } from '~/lib/xlsx-io/export';
import { importMultisheet, type CommunityEntry } from '~/lib/xlsx-io/import';

describe('export to xlsx (multisheet format)', () => {
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
        propertyList: {
          include: {
            updatedBy: true,
          },
          orderBy: DEFAULT_PROPERTY_ORDER_BY,
        },
      },
    });
    const helper = new ExportMultisheet(community);
    const xlsxBuf = helper.toXlsx();

    // Compare exported XLSX against original XLSX
    const actualwb = XLSX.read(xlsxBuf);
    const { propertyList, paymentMethodList } = importMultisheet(actualwb);

    expect(propertyList).toEqual(expectedImportResult.propertyList);
    expect(paymentMethodList).toEqual(expectedImportResult.paymentMethodList);
  });
});
