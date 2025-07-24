import path from 'path';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { TestUtil } from '~/graphql/test-util';
import { MockBatchGeocode, mockGeocodeResult } from '~/lib/geoapify-api/mock';
import { BatchModify } from '../batch-modify/batch-modify';

const communityInfoDocument = graphql(/* GraphQL */ `
  query BatchPropertyModifyAddGpsSpec_CommunityInfo {
    userCurrent {
      accessList {
        community {
          id
          updatedAt
        }
      }
    }
  }
`);

const addGeoapifyApikeyDocument = graphql(/* GraphQL */ `
  mutation BatchPropertyModifyAddGpsSpec_AddGeoapifyKey(
    $input: CommunityModifyInput!
  ) {
    communityModify(input: $input) {
      id
    }
  }
`);

const filteredPropertyListDocument = graphql(/* GraphQL */ `
  query BatchPropertyModifyAddGpsSpec_FilteredPropertyList(
    $id: String!
    $filter: PropertyFilterInput!
  ) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
        id
        address
        lat
        lon
      }
    }
  }
`);

interface Expected {
  /** Number of properties modified */
  matchCount: number;
}

type TestCaseEntry = [
  string, // test case description
  GQL.PropertyFilterInput, // filter to apply
  Expected, // expected results
];

type Community =
  GQL.BatchPropertyModifyAddGpsSpec_CommunityInfoQuery['userCurrent']['accessList'][number]['community'];

describe('BatchPropertyModify - Add GPS', () => {
  const testUtil = new TestUtil();
  let targetCommunity: Community | undefined;

  beforeAll(async () => {
    await testUtil.initialize();
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  beforeEach(async () => {
    await testUtil.database.seed(
      path.join(process.cwd(), '__fixtures__', 'simple.xlsx')
    );
    const result = await testUtil.graphql.executeSingle({
      document: communityInfoDocument,
    });
    targetCommunity = result.data?.userCurrent.accessList[0].community;
    // Add Geoapify API key for testing purpose
    await testUtil.graphql.executeSingle({
      document: addGeoapifyApikeyDocument,
      variables: {
        input: {
          self: {
            id: targetCommunity!.id,
            updatedAt: targetCommunity!.updatedAt,
          },
          geoapifySetting: {
            apiKey: 'test-geoapify-api',
          },
        },
      },
    });
  });

  afterEach(async () => {
    await testUtil.database.dropDatabase();
    jest.clearAllMocks();
  });

  const cases: TestCaseEntry[] = [
    [
      'add GPS information for those with 2021 membership',
      { memberYear: 2021 },
      {
        // There is only 1 property matching 2021 membership
        matchCount: 1,
      },
    ],
    [
      'add GPS information for properties with missing GPS',
      { withGps: false },
      {
        matchCount: 2,
      },
    ],
    [
      'update GPS information for properties with GPS',
      { withGps: true },
      {
        matchCount: 0,
      },
    ],
  ];

  test.each(cases)('%s', async (description, filter, expected) => {
    const oldPropertyListResult = await testUtil.graphql.executeSingle({
      document: filteredPropertyListDocument,
      variables: {
        id: targetCommunity!.id,
        filter,
      },
    });
    const oldPropertyList =
      oldPropertyListResult.data?.communityFromId.rawPropertyList ?? [];

    const expectedGeoData = Array.from({ length: oldPropertyList.length }, () =>
      mockGeocodeResult()
    );
    const spy = MockBatchGeocode.searchFreeForm.mockImplementation(
      async () => expectedGeoData
    );

    const batchModify = new BatchModify(testUtil.graphql.context.user, {
      self: {
        id: targetCommunity!.id,
        updatedAt: targetCommunity!.updatedAt,
      },
      method: GQL.BatchModifyMethod.AddGps,
      filter,
      gps: {
        city: 'city',
        province: 'province',
        country: 'country',
      },
    });
    const result = await batchModify.start();

    const expectedAddressList = oldPropertyList.map(({ address }) =>
      [address, 'city', 'province', 'country'].join(',')
    );
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(expectedAddressList, expect.anything());

    const propertyList = result;
    expect(oldPropertyList).toHaveLength(expected.matchCount);
    expect(propertyList).toHaveLength(expected.matchCount);
    for (const [idx, property] of propertyList.entries()) {
      // Compare GPS information between old and new property
      expect(property.lat).toBe(expectedGeoData[idx].lat?.toString());
      expect(property.lon).toBe(expectedGeoData[idx].lon?.toString());
    }
  });
});
