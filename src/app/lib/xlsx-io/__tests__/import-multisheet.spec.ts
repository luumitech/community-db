import path from 'path';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';

describe('import community xlsx (multisheet format)', () => {
  const testUtil = new TestUtil();

  beforeAll(async () => {
    await testUtil.initialize();
    await testUtil.database.seed(
      path.join(process.cwd(), '__fixtures__', 'simple-multisheet.xlsx')
    );
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('verify property lists', async () => {
    const document = graphql(/* GraphQL */ `
      query ImportMultisheet_UserCurrent {
        userCurrent {
          email
          accessList {
            role
            community {
              id
              name
              minYear
              maxYear
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
                    occupancyInfoList {
                      startDate
                      endDate
                      occupantList {
                        firstName
                        lastName
                        optOut
                        infoList {
                          label
                          type
                          value
                        }
                      }
                    }
                    membershipList {
                      year
                      isMember
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
                      price
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
    const { community } = accessList[0];
    expect(community.minYear).toBe(2021);
    expect(community.maxYear).toBe(2024);
    const adventure = community.propertyList.edges[0].node;
    const fortune = community.propertyList.edges[1].node;
    expect(adventure.updatedBy?.email).toBe('test@email.com');
    expect(fortune).toEqual({
      __typename: 'Property',
      address: '99 Fortune Drive',
      streetNo: 99,
      streetName: 'Fortune Drive',
      postalCode: 'A0A0A0',
      notes: 'Notes',
      updatedAt: '2023-02-23T03:19:09.000Z',
      updatedBy: null,
      occupancyInfoList: [
        {
          __typename: 'OccupancyInfo',
          startDate: null,
          endDate: null,
          occupantList: [
            {
              __typename: 'Occupant',
              firstName: 'First1',
              lastName: 'Last1',
              optOut: false,
              infoList: [
                {
                  __typename: 'ContactInfo',
                  type: 'EMAIL',
                  label: 'email',
                  value: 'Email1',
                },
                {
                  __typename: 'ContactInfo',
                  type: 'PHONE',
                  label: 'home',
                  value: '4161234567',
                },
                {
                  __typename: 'ContactInfo',
                  type: 'PHONE',
                  label: 'work',
                  value: '4162345678',
                },
                {
                  __typename: 'ContactInfo',
                  type: 'PHONE',
                  label: 'cell',
                  value: '4163456789',
                },
              ],
            },
            {
              __typename: 'Occupant',
              firstName: 'First2',
              lastName: 'Last2',
              optOut: true,
              infoList: [
                {
                  __typename: 'ContactInfo',
                  type: 'EMAIL',
                  label: 'email',
                  value: 'Email2',
                },
                {
                  __typename: 'ContactInfo',
                  type: 'PHONE',
                  label: 'home',
                  value: '4171234567',
                },
              ],
            },
            {
              __typename: 'Occupant',
              firstName: 'First3',
              lastName: 'Last3',
              optOut: null,
              infoList: [
                {
                  __typename: 'ContactInfo',
                  type: 'EMAIL',
                  label: 'email',
                  value: 'Email3',
                },
              ],
            },
          ],
        },
      ],
      membershipList: [
        {
          __typename: 'Membership',
          eventAttendedList: [],
          isMember: false,
          paymentDeposited: false,
          paymentMethod: null,
          price: null,
          year: 2024,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Summer Festival',
              eventDate: '2023-06-11',
              ticketList: [
                {
                  __typename: 'Ticket',
                  count: 20,
                  paymentMethod: 'free',
                  price: '0',
                  ticketName: 'meal',
                },
                {
                  __typename: 'Ticket',
                  count: 1,
                  paymentMethod: 'cash',
                  price: '1',
                  ticketName: 'cotton-candy',
                },
              ],
            },
            {
              __typename: 'Event',
              eventName: 'Corn Roast',
              eventDate: '2023-08-20',
              ticketList: [
                {
                  __typename: 'Ticket',
                  count: 10,
                  paymentMethod: 'cash',
                  price: '5',
                  ticketName: 'meal',
                },
                {
                  __typename: 'Ticket',
                  count: 1,
                  paymentMethod: 'e-Transfer',
                  price: '1',
                  ticketName: 'drink',
                },
              ],
            },
          ],
          isMember: true,
          paymentDeposited: true,
          paymentMethod: 'e-Transfer',
          price: '10',
          year: 2023,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Membership Carry Forward',
              eventDate: '2022-02-10',
              ticketList: [],
            },
          ],
          isMember: true,
          paymentDeposited: false,
          paymentMethod: 'free',
          price: null,
          year: 2022,
        },
        {
          __typename: 'Membership',
          eventAttendedList: [
            {
              __typename: 'Event',
              eventName: 'Membership Carry Forward',
              eventDate: '2021-01-23',
              ticketList: [],
            },
          ],
          isMember: true,
          paymentDeposited: false,
          paymentMethod: 'free',
          price: null,
          year: 2021,
        },
      ],
    });
  });
});
