import path from 'path';
import * as XLSX from 'xlsx';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';
import { importLcraDB } from '~/lib/import-community';
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
    const propertyList = importLcraDB(workbook);
    const communitySeed = [
      {
        name: 'Test Community',
        propertyList: {
          create: propertyList,
        },
      },
    ];

    await prisma.user.create({
      data: {
        email: 'jest@email.com',
        communityList: {
          create: communitySeed,
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
          communityList {
            id
            name
            propertyList(first: 1) {
              edges {
                node {
                  address
                  postalCode
                  notes
                  updatedAt
                  updatedBy
                  occupantList {
                    firstName
                    lastName
                    optOut
                    home
                    work
                    cell
                  }
                  membershipList {
                    year
                    isMember
                    eventAttended
                    paymentDate
                    paymentMethod
                    paymentDeposited
                  }
                }
              }
            }
          }
        }
      }
    `);

    const result = await testUtil.graphql.executeSingle({ document });
    const communityList = result.data?.userCurrent.communityList ?? [];
    expect(communityList).toHaveLength(1);
    const firstProperty = communityList[0].propertyList.edges[0].node;
    expect(firstProperty).toEqual({
      address: '99 Fortune Drive',
      postalCode: 'A0A0A0',
      notes: 'Notes',
      updatedAt: '2023-02-23T03:19:09.000Z',
      updatedBy: 'testuser',
      occupantList: [
        {
          firstName: 'First1',
          lastName: 'Last1',
          optOut: false,
          cell: '4163456789',
          home: '4161234567',
          work: '4162345678',
        },
        {
          firstName: 'First2',
          lastName: 'Last2',
          optOut: true,
          cell: null,
          home: '4171234567',
          work: null,
        },
        {
          firstName: 'First3',
          lastName: 'Last3',
          optOut: null,
          cell: null,
          home: null,
          work: null,
        },
      ],
      membershipList: [
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2002,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2003,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2004,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2005,
        },
        {
          eventAttended: 'Other',
          isMember: true,
          paymentDate: '2006-01-01',
          paymentDeposited: true,
          paymentMethod: 'cash',
          year: 2006,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2007,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2008,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2009,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2010,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2011,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2012,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2013,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2014,
        },
        {
          eventAttended: 'Other',
          isMember: true,
          paymentDate: '2015-01-01',
          paymentDeposited: true,
          paymentMethod: 'cash',
          year: 2015,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2016,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2017,
        },
        {
          eventAttended: 'Other',
          isMember: true,
          paymentDate: '2018-01-01',
          paymentDeposited: true,
          paymentMethod: 'cash',
          year: 2018,
        },
        {
          eventAttended: 'Corn Roast',
          isMember: true,
          paymentDate: '2019-08-18',
          paymentDeposited: false,
          paymentMethod: 'cash',
          year: 2019,
        },
        {
          eventAttended: 'Membership Form',
          isMember: true,
          paymentDate: '2020-11-11',
          paymentDeposited: false,
          paymentMethod: 'cash',
          year: 2020,
        },
        {
          eventAttended: 'Membership Carry Forward',
          isMember: true,
          paymentDate: '2021-01-24',
          paymentDeposited: false,
          paymentMethod: 'free',
          year: 2021,
        },
        {
          eventAttended: 'Membership Carry Forward',
          isMember: true,
          paymentDate: '2022-02-11',
          paymentDeposited: false,
          paymentMethod: 'free',
          year: 2022,
        },
        {
          eventAttended: 'Membership Form',
          isMember: true,
          paymentDate: '2023-02-23',
          paymentDeposited: true,
          paymentMethod: 'e-Transfer',
          year: 2023,
        },
        {
          eventAttended: null,
          isMember: false,
          paymentDate: null,
          paymentDeposited: false,
          paymentMethod: null,
          year: 2024,
        },
      ],
    });
  });
});
