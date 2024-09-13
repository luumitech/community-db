import path from 'path';
import * as XLSX from 'xlsx';
import { TestUtil } from '~/graphql/test-util';
import { ExportHelper } from '~/lib/lcra-community/export';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

describe('export community xlsx', () => {
  const testUtil = new TestUtil();
  let expectedImportResult: ReturnType<typeof importLcraDB>;

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
        },
      },
    });
    const helper = new ExportHelper(community.propertyList);
    const xlsxBuf = helper.toXlsx();

    // Compare exported XLSX against original XLSX
    const actualwb = XLSX.read(xlsxBuf);
    const { propertyList, paymentMethodList } = importLcraDB(actualwb);

    expect(propertyList).toEqual(expectedImportResult.propertyList);
    expect(paymentMethodList).toEqual(expectedImportResult.paymentMethodList);
  });
});
