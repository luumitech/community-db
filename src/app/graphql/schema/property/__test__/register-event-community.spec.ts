import path from 'path';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { TestUtil } from '~/graphql/test-util';

const communityInfoDocument = graphql(/* GraphQL */ `
  query RegisterEventCommunitySpec_CommunityInfo {
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
                    ticketList {
                      ticketName
                    }
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
  GQL.RegisterEventCommunitySpec_CommunityInfoQuery['userCurrent']['accessList'][number]['community'];
type Property = Community['propertyList']['edges'][number]['node'];

const registerEventDocument = graphql(/* GraphQL */ `
  mutation RegisterEventCommunitySpec_RegisterEvent(
    $input: RegisterEventInput!
  ) {
    registerEvent(input: $input) {
      community {
        id
        updatedAt
        minYear
        maxYear
      }
      property {
        id
        membershipList {
          year
          eventAttendedList {
            eventName
            eventDate
            ticketList {
              ticketName
              count
              price
              paymentMethod
            }
          }
        }
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

type PropertyInput = Pick<Property, 'membershipList'>;

/**
 * Find event of a specified name
 *
 * @param property
 * @param year
 * @param eventName
 * @returns Event object
 */
function findEvent(property: PropertyInput, year: number, eventName: string) {
  const membershipList = property?.membershipList ?? [];
  const membership = membershipList.find((entry) => year === entry.year);
  if (!membership) {
    return undefined;
  }

  const event = membership.eventAttendedList.find(
    (entry) => eventName === entry.eventName
  );
  return event;
}

describe('Register Event (minYear/maxYear changes)', () => {
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
      'add 2023 membership (does not change min/max Year)',
      {
        year: 2023,
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
    const newEventName = 'Corn Roast';
    const newTicket = {
      ticketName: 'fries',
      count: 1,
      price: '2.00',
      paymentMethod: 'cash',
    };
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
            eventName: newEventName,
            eventDate: new Date(Date.UTC(2024, 11, 31)).toISOString(),
            ticketList: [newTicket],
          },
        },
      },
    });
    const { community, property } = result.data?.registerEvent ?? {};
    expect(community?.minYear).toBe(expected.minYear);
    expect(community?.maxYear).toBe(expected.maxYear);
    const actualCommunityUpdated = new Date(community?.updatedAt ?? '');
    const originalCommunityUpdated = new Date(firstCommunity?.updatedAt ?? '');
    if (expected.communityUpdated) {
      expect(actualCommunityUpdated).toBeAfter(originalCommunityUpdated);
    } else {
      expect(actualCommunityUpdated).toStrictEqual(originalCommunityUpdated);
    }

    const event = findEvent(property!, newEvent.year, newEventName);
    expect(event).toBeDefined();

    // Verify new ticketList contains new ticket as well as previous ones
    const originalEvent = findEvent(
      firstProperty!,
      newEvent.year,
      newEventName
    );
    expect(event!.ticketList).toEqual([
      ...(originalEvent?.ticketList ?? []).map(expect.objectContaining),
      expect.objectContaining(newTicket),
    ]);
  });
});
