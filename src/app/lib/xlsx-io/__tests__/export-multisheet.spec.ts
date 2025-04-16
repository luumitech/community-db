import { type DefaultSetting } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { DEFAULT_PROPERTY_ORDER_BY } from '~/graphql/schema/property/util';
import { TestUtil } from '~/graphql/test-util';
import prisma from '~/lib/prisma';
import { ExportMultisheet } from '~/lib/xlsx-io/export';
import { type CommunityEntry } from '~/lib/xlsx-io/import';
import { importMultisheet } from '~/lib/xlsx-io/import/format-multisheet';

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
        updatedBy: true,
        propertyList: {
          include: {
            updatedBy: true,
          },
          orderBy: DEFAULT_PROPERTY_ORDER_BY,
        },
      },
    });

    // Multisheet format support saving of defaultSettings
    const expectedDefaultSetting: DefaultSetting = {
      membershipFee: '15',
      membershipEmail: null,
    };
    community.defaultSetting = expectedDefaultSetting;

    const helper = new ExportMultisheet(community);
    const xlsxBuf = helper.toXlsx();

    // Compare exported XLSX against original XLSX
    const actualwb = XLSX.read(xlsxBuf);
    const actualImportResult = importMultisheet(actualwb);

    expect(actualImportResult.name).toEqual(expectedImportResult.name);
    expect(actualImportResult.propertyList).toEqual(
      expectedImportResult.propertyList
    );
    expect(actualImportResult.paymentMethodList).toEqual(
      expectedImportResult.paymentMethodList
    );
    expect(actualImportResult.paymentMethodList).toEqual(
      expectedImportResult.paymentMethodList
    );

    // verify defaultSetting
    expect(actualImportResult.defaultSetting).toEqual(expectedDefaultSetting);
  });
});
