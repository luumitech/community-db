import { Prisma } from '@prisma/client';
import path from 'path';
import * as XLSX from 'xlsx';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';

describe('import community xlsx', () => {
  const testUtil = new TestUtil();

  beforeAll(async () => {
    await testUtil.initialize();

    const workbook = XLSX.readFile(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'prisma',
        'lcra-db.xlsx'
      )
    );
    const { eventList, propertyList } = importLcraDB(workbook);
    const communitySeed: Prisma.CommunityCreateInput[] = [
      {
        name: 'Test Community',
        eventList,
        propertyList: {
          create: propertyList,
        },
      },
    ];

    const accessSeed: Prisma.AccessCreateWithoutUserInput[] = communitySeed.map(
      (community) => ({
        role: 'ADMIN',
        community: {
          create: community,
        },
      })
    );

    await prisma.user.create({
      data: {
        email: 'jest@email.com',
        accessList: {
          create: accessSeed,
        },
      },
    });
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('verify property lists', async () => {
    const document = graphql(/* GraphQL */ `
      query SampleUserCurrent {
        userCurrent {
          email
          accessList {
            role
            community {
              id
              name
              propertyList(first: 2) {
                edges {
                  node {
                    address
                    streetNo
                    streetName
                    postalCode
                    notes
                    updatedAt
                    updatedBy {
                      email
                    }
                    occupantList {
                      firstName
                      lastName
                      optOut
                      email
                      home
                      work
                      cell
                    }
                    membershipList {
                      year
                      isMember
                      eventAttendedList {
                        eventName
                        eventDate
                      }
                      paymentMethod
                      paymentDeposited
                    }
                  }
                }
              }
            }
          }
        }
      }
    `);

    const result = await testUtil.graphql.executeSingle({ document });
    const accessList = result.data?.userCurrent.accessList ?? [];
    expect(accessList).toHaveLength(1);
    const adventure = accessList[0].community.propertyList.edges[0].node;
    const fortune = accessList[0].community.propertyList.edges[1].node;
    expect(adventure.updatedBy?.email).toBe('testuser');
    expect(fortune).toEqual({
      __typename: 'Property',
      address: '99 Fortune Drive',
      streetNo: '99',
      streetName: 'Fortune Drive',
      postalCode: 'A0A0A0',
      notes: 'Notes',
      updatedAt: '2023-02-23T03:19:09.000Z',
      updatedBy: null,
      occupantList: [
        {
          __typename: 'Occupant',
          firstName: 'First1',
          lastName: 'Last1',
          email: 'Email1',
          optOut: false,
          cell: '4163456789',
          home: '4161234567',
          work: '4162345678',
        },
        {
          __typename: 'Occupant',
          firstName: 'First2',
          lastName: 'Last2',
          email: 'Email2',
          optOut: true,
          cell: null,
          home: '4171234567',
          work: null,
        },
        {
          __typename: 'Occupant',
          firstName: 'First3',
          lastName: 'Last3',
          email: 'Email3',
          optOut: null,
          cell: null,
          home: null,
          work: null,
        },
      ],
      membershipList: [
        {
          __typename: 'Membership',
          eventAttendedList: [],
          isMember: false,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2024,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Summer Festival',
              eventDate: '2023-06-11',
            },
            {
              __typename: 'Event',
              eventName: 'Corn Roast',
              eventDate: '2023-08-20',
            },
          ],
          isMember: true,
          paymentDeposited: true,
          paymentMethod: 'e-Transfer',
          year: 2023,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Membership Carry Forward',
              eventDate: '2022-02-10',
            },
          ],
          isMember: true,
          paymentDeposited: false,
          paymentMethod: 'free',
          year: 2022,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Membership Carry Forward',
              eventDate: '2021-01-23',
            },
          ],
          isMember: true,
          paymentDeposited: false,
          paymentMethod: 'free',
          year: 2021,
        },
      ],
    });
  });
});
