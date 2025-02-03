import path from 'path';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { TestUtil } from '~/graphql/test-util';

const communityInfoDocument = graphql(/* GraphQL */ `
  query PropertyModifySpec_CommunityInfo {
    userCurrent {
      accessList {
        community {
          id
          updatedAt
          propertyList(first: 1) {
            edges {
              node {
                id
                updatedAt
                membershipList {
                  year
                  eventAttendedList {
                    eventName
                    eventDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

type Community =
  GQL.PropertyModifySpec_CommunityInfoQuery['userCurrent']['accessList'][0]['community'];
type Property = Community['propertyList']['edges'][0]['node'];

const propertyModifyDocument = graphql(/* GraphQL */ `
  mutation PropertyModifySpec_PropertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      community {
        id
        updatedAt
        minYear
        maxYear
      }
      property {
        id
      }
    }
  }
`);

interface NewEvent {
  year: number;
}

interface Expected {
  minYear: number;
  maxYear: number;
  communityUpdated: boolean;
}

type TestCaseEntry = [
  string, // test case description
  NewEvent, // New event to add to first property
  Expected, // expected results
];

describe('Property Modify (minYear/maxYear changes)', () => {
  const testUtil = new TestUtil();
  let firstCommunity: Community | undefined;
  let firstProperty: Property | undefined;

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
    firstCommunity = result.data?.userCurrent.accessList[0].community;
    firstProperty = firstCommunity?.propertyList.edges[0].node;
  });

  afterEach(async () => {
    await testUtil.database.dropDatabase();
  });

  const cases: TestCaseEntry[] = [
    [
      'add 2022 membership (does not change min/max Year)',
      {
        year: 2022,
      },
      {
        minYear: 2021,
        maxYear: 2024,
        communityUpdated: false,
      },
    ],
    [
      'add 2020 membership (changes minYear)',
      {
        year: 2020,
      },
      {
        minYear: 2020,
        maxYear: 2024,
        communityUpdated: true,
      },
    ],
    [
      'add 2025 membership (changes maxYear)',
      {
        year: 2025,
      },
      {
        minYear: 2021,
        maxYear: 2025,
        communityUpdated: true,
      },
    ],
  ];

  test.each(cases)('%s', async (description, newEvent, expected) => {
    const result = await testUtil.graphql.executeSingle({
      document: propertyModifyDocument,
      variables: {
        input: {
          self: {
            id: firstProperty?.id ?? '',
            updatedAt: firstProperty?.updatedAt ?? '',
          },
          membershipList: [
            {
              year: newEvent.year,
              paymentMethod: 'custom-test-payment',
              eventAttendedList: [
                {
                  eventName: 'New Years Eve',
                  eventDate: new Date(Date.UTC(2024, 11, 31)).toISOString(),
                },
              ],
            },
          ],
        },
      },
    });
    const { community } = result.data?.propertyModify ?? {};
    expect(community?.minYear).toBe(expected.minYear);
    expect(community?.maxYear).toBe(expected.maxYear);
    const actualCommunityUpdated = new Date(community?.updatedAt ?? '');
    const originalCommunityUpdated = new Date(firstCommunity?.updatedAt ?? '');
    if (expected.communityUpdated) {
      expect(actualCommunityUpdated).toBeAfter(originalCommunityUpdated);
    } else {
      expect(actualCommunityUpdated).toStrictEqual(originalCommunityUpdated);
    }
  });
});
