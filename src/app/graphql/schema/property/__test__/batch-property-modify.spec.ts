import { type Event } from '@prisma/client';
import path from 'path';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { TestUtil } from '~/graphql/test-util';
import { getPropertyEntry } from '../util';

const communityInfoDocument = graphql(/* GraphQL */ `
  query BatchPropertyModifySpec_CommunityInfo {
    userCurrent {
      accessList {
        community {
          id
        }
      }
    }
  }
`);

const filteredPropertyListDocument = graphql(/* GraphQL */ `
  query BatchPropertyModifySpec_FilteredPropertyList(
    $id: String!
    $filter: PropertyFilterInput!
  ) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
        id
        membershipList {
          year
          price
          paymentMethod
          isMember
        }
      }
    }
  }
`);

const batchModifyDocument = graphql(/* GraphQL */ `
  mutation BatchPropertyModifySpec_BatchModify(
    $input: BatchPropertyModifyInput!
  ) {
    batchPropertyModify(input: $input) {
      community {
        id
        minYear
        maxYear
      }
      propertyList {
        id
        address
        membershipList {
          year
          price
          eventAttendedList {
            eventName
            eventDate
          }
        }
      }
    }
  }
`);

interface NewEvent {
  year: number;
  paymentMethod: string;
  price: string;
  eventName: string;
  eventDate: Date;
}

interface Expected {
  /** Number of properties modified */
  matchCount: number;
  minYear: number;
  maxYear: number;
}

type TestCaseEntry = [
  string, // test case description
  GQL.PropertyFilterInput, // filter to apply
  NewEvent, // New event add to properties matching the filter above
  Expected, // expected results
];

describe('BatchPropertyModify', () => {
  const testUtil = new TestUtil();
  let communityId: string | undefined;

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
    communityId = result.data?.userCurrent.accessList[0].community.id;
  });

  afterEach(async () => {
    await testUtil.database.dropDatabase();
  });

  const cases: TestCaseEntry[] = [
    [
      'add 2024 membership for those with 2021 membership',
      { memberYear: 2021 },
      {
        year: 2024,
        paymentMethod: 'custom-test-payment',
        price: '10.00',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There is only 1 property matching 2021 membership
        matchCount: 1,
        minYear: 2021,
        maxYear: 2024,
      },
    ],
    [
      'modify 2022 membership for those with 2022 membership',
      { memberYear: 2022 },
      {
        year: 2022,
        paymentMethod: 'custom-test-payment',
        price: '10.00',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There is 1 properties matching 2022 membership
        matchCount: 1,
        minYear: 2021,
        maxYear: 2024,
      },
    ],
    [
      'modify 2023 membership for those with 2023 membership',
      { memberYear: 2023 },
      {
        year: 2023,
        paymentMethod: 'custom-test-payment',
        price: '15.00',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There are 2 properties matching 2023 membership
        matchCount: 2,
        minYear: 2021,
        maxYear: 2024,
      },
    ],
    [
      'modify 2024 membership for those with 2024 membership',
      { memberYear: 2024 },
      {
        year: 2024,
        paymentMethod: 'custom-test-payment',
        price: '10.00',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There are 0 properties matching 2024 membership
        matchCount: 0,
        minYear: 2021,
        maxYear: 2024,
      },
    ],
    [
      'add 2025 membership for those with 2023 membership',
      { memberYear: 2023 },
      {
        year: 2025,
        paymentMethod: 'custom-test-payment',
        price: '10',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2025, 11, 31)),
      },
      {
        // There are 2 properties matching 2023 membership
        matchCount: 2,
        minYear: 2021,
        maxYear: 2025,
      },
    ],
    [
      'add 2020 membership for those with 2023 membership',
      { memberYear: 2023 },
      {
        year: 2020,
        paymentMethod: 'custom-test-payment',
        price: '5',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2020, 11, 31)),
      },
      {
        // There are 2 properties matching 2023 membership
        matchCount: 2,
        minYear: 2020,
        maxYear: 2024,
      },
    ],
  ];

  test.each(cases)('%s', async (description, filter, newEvent, expected) => {
    const oldPropertyListResult = await testUtil.graphql.executeSingle({
      document: filteredPropertyListDocument,
      variables: {
        id: communityId!,
        filter,
      },
    });
    const oldPropertyList =
      oldPropertyListResult.data?.communityFromId.rawPropertyList ?? [];

    const result = await testUtil.graphql.executeSingle({
      document: batchModifyDocument,
      variables: {
        input: {
          communityId: communityId!,
          filter,
          membership: {
            year: newEvent.year,
            paymentMethod: newEvent.paymentMethod,
            price: newEvent.price,
            eventAttended: {
              eventName: newEvent.eventName,
              eventDate: newEvent.eventDate.toISOString(),
            },
          },
        },
      },
    });

    expect(result.errors).toBeUndefined();
    const { community, propertyList } = result.data?.batchPropertyModify ?? {};
    expect(community?.minYear).toBe(expected.minYear);
    expect(community?.maxYear).toBe(expected.maxYear);
    expect(oldPropertyList).toHaveLength(expected.matchCount);
    expect(propertyList).toHaveLength(expected.matchCount);
    for (const { id } of propertyList ?? []) {
      const oldProperty = oldPropertyList.find((entry) => entry.id === id)!;
      const property = await getPropertyEntry(
        testUtil.graphql.context.user,
        id
      );
      const oldMembership = oldProperty.membershipList.find(
        ({ year }) => year === newEvent.year
      );
      const membership = property.membershipList.find(
        ({ year }) => year === newEvent.year
      );

      // Verify that existing membership keep original payment method
      if (oldMembership?.isMember) {
        expect(membership?.paymentMethod).toBe(oldMembership.paymentMethod);
      } else {
        expect(membership?.paymentMethod).toBe(newEvent.paymentMethod);
      }

      // Verify that existing membership keep original membership price
      if (oldMembership?.price != null) {
        expect(membership?.price).toBe(oldMembership.price);
      } else {
        expect(membership?.price).toBe(newEvent.price);
      }

      // Make sure the modified document contains the new event
      const expectedEvent: Event = {
        eventName: newEvent.eventName,
        eventDate: newEvent.eventDate,
        ticketList: [],
      };
      expect(membership?.eventAttendedList).toIncludeAnyMembers([
        expectedEvent,
      ]);
    }
  });
});
