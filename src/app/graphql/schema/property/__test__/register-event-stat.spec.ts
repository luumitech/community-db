import path from 'path';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { TestUtil } from '~/graphql/test-util';

const communityInfoDocument = graphql(/* GraphQL */ `
  query RegisterEventStatSpec_CommunityInfo {
    userCurrent {
      accessList {
        community {
          id
          propertyList(first: 1) {
            edges {
              node {
                id
                updatedAt
              }
            }
          }
        }
      }
    }
  }
`);

const communityStatDocument = graphql(/* GraphQL */ `
  query RegisterEventStatSpec_CommunityStat($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        memberSourceStat(year: $year) {
          eventName
          new
          renew
          existing
        }
      }
    }
  }
`);

type Community =
  GQL.RegisterEventStatSpec_CommunityInfoQuery['userCurrent']['accessList'][number]['community'];
type Property = Community['propertyList']['edges'][number]['node'];
type CommunityStat =
  GQL.RegisterEventStatSpec_CommunityStatQuery['communityFromId']['communityStat']['memberSourceStat'];

const registerEventDocument = graphql(/* GraphQL */ `
  mutation RegisterEventStatSpec_RegisterEvent($input: RegisterEventInput!) {
    registerEvent(input: $input) {
      community {
        id
      }
    }
  }
`);

/**
 * Get information on community statistics of a given year
 *
 * @param testUtil Test utility
 * @param year Year to get member statistics for
 * @returns
 */
async function getCommunityStat(
  testUtil: TestUtil,
  communityId: string,
  year: number
) {
  const result = await testUtil.graphql.executeSingle({
    document: communityStatDocument,
    variables: { id: communityId, year },
  });
  const community = result.data?.communityFromId;
  const stat = community?.communityStat.memberSourceStat;
  return stat;
}

/**
 * Find statistics for specified event name
 *
 * @param stat Community stat for a given year
 * @param eventName Event name to retrieve statistics for
 * @returns
 */
async function findEventStat(
  stat: CommunityStat | undefined,
  eventName: string
) {
  return stat?.find((entry) => entry.eventName === eventName);
}

interface NewEvent {
  year: number;
  eventName: string;
}

interface Stat {
  new: number;
  renew: number;
  existing: number;
}

interface Expected {
  // stat before registration
  beforeStat?: Stat;
  // stat after registration
  afterStat: Stat;
}

type TestCaseEntry = [
  string, // test case description
  NewEvent, // New event to add to first property
  Expected, // expected results
];

describe('Register Event (community stat changes)', () => {
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
      path.join(process.cwd(), '__fixtures__', 'simple-lcra.xlsx')
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
      'add 2023 membership (already registered)',
      {
        year: 2023,
        eventName: 'Corn Roast',
      },
      {
        beforeStat: {
          new: 1,
          renew: 0,
          existing: 1,
        },
        afterStat: {
          new: 1,
          renew: 0,
          existing: 1,
        },
      },
    ],
    [
      'add 2024 membership (renews membership)',
      {
        year: 2024,
        eventName: 'Corn Roast',
      },
      {
        beforeStat: {
          new: 0,
          renew: 0,
          existing: 0,
        },
        afterStat: {
          new: 0,
          renew: 1,
          existing: 0,
        },
      },
    ],
    [
      'add 2025 membership (new membership)',
      {
        year: 2025,
        eventName: 'Corn Roast',
      },
      {
        beforeStat: undefined,
        afterStat: {
          new: 1,
          renew: 0,
          existing: 0,
        },
      },
    ],
  ];

  test.each(cases)('%s', async (description, newEvent, expected) => {
    // Verify event statistics before registration
    const beforeStat = await getCommunityStat(
      testUtil,
      firstCommunity!.id,
      newEvent.year
    );
    let stat = await findEventStat(beforeStat, newEvent.eventName);
    if (stat != null) {
      expect(stat).toEqual(expect.objectContaining(expected.beforeStat));
    } else {
      expect(stat).toEqual(expected.beforeStat);
    }

    const result = await testUtil.graphql.executeSingle({
      document: registerEventDocument,
      variables: {
        input: {
          self: {
            id: firstProperty?.id ?? '',
            updatedAt: firstProperty?.updatedAt ?? '',
          },
          membership: {
            year: newEvent.year,
            paymentMethod: 'custom-test-payment',
          },
          event: {
            eventName: newEvent.eventName,
            eventDate: new Date(Date.UTC(newEvent.year, 11, 31)).toISOString(),
            ticketList: [],
          },
        },
      },
    });

    // Verify event statistics after registration
    const afterStat = await getCommunityStat(
      testUtil,
      firstCommunity!.id,
      newEvent.year
    );
    stat = await findEventStat(afterStat, newEvent.eventName);
    expect(stat).toEqual(expect.objectContaining(expected.afterStat));
  });
});
