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

const batchModifyDocument = graphql(/* GraphQL */ `
  mutation BatchPropertyModifySpec_BatchModify(
    $input: BatchPropertyModifyInput!
  ) {
    batchPropertyModify(input: $input) {
      id
      address
      membershipList {
        year
        eventAttendedList {
          eventName
          eventDate
        }
      }
    }
  }
`);

interface NewEvent {
  year: number;
  paymentMethod: string;
  eventName: string;
  eventDate: Date;
}

interface Expected {
  /** Number of properties modified */
  matchCount: number;
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
      'modify 2021 membership',
      { memberYear: 2021 },
      {
        year: 2024,
        paymentMethod: 'custom-test-payment',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There is only 1 property matching 2021 membership
        matchCount: 1,
      },
    ],
    [
      'modify 2023 membership',
      { memberYear: 2023 },
      {
        year: 2023,
        paymentMethod: 'custom-test-payment',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There are 2 properties matching 2023 membership
        matchCount: 2,
      },
    ],
    [
      'modify 2024 membership',
      { memberYear: 2024 },
      {
        year: 2024,
        paymentMethod: 'custom-test-payment',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There are 0 properties matching 2024 membership
        matchCount: 0,
      },
    ],
    [
      'modify 2025 membership',
      { memberYear: 2023 },
      {
        year: 2025,
        paymentMethod: 'custom-test-payment',
        eventName: 'New Years Eve',
        eventDate: new Date(Date.UTC(2024, 11, 31)),
      },
      {
        // There are 2 properties matching 2023 membership
        matchCount: 2,
      },
    ],
  ];

  test.each(cases)('%s', async (description, filter, newEvent, expected) => {
    const result = await testUtil.graphql.executeSingle({
      document: batchModifyDocument,
      variables: {
        input: {
          communityId: communityId!,
          filter,
          membership: {
            year: newEvent.year,
            paymentMethod: newEvent.paymentMethod,
            eventAttended: {
              eventName: newEvent.eventName,
              eventDate: newEvent.eventDate.toISOString(),
            },
          },
        },
      },
    });

    const propertyList = result.data?.batchPropertyModify;
    expect(propertyList).toHaveLength(expected.matchCount);
    for (const { id } of propertyList ?? []) {
      const property = await getPropertyEntry(
        testUtil.graphql.context.user,
        id
      );
      const membership = property.membershipList.find(
        ({ year }) => year === newEvent.year
      );
      // Verify the modified document has the correct paymentMethod
      if (membership?.eventAttendedList.length === 1) {
        expect(membership?.paymentMethod).toBe(newEvent.paymentMethod);
      } else {
        expect(membership?.paymentMethod).not.toBe(newEvent.paymentMethod);
      }
      // Make sure the modified document contains the new event
      expect(membership?.eventAttendedList).toIncludeAnyMembers([
        {
          eventName: newEvent.eventName,
          eventDate: newEvent.eventDate,
        },
      ]);
    }
  });
});
