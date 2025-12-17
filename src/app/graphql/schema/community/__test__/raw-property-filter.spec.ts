import path from 'path';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';

const document = graphql(/* GraphQL */ `
  query RawPropertyFilterSpec_RawPropertyList($filter: PropertyFilterInput!) {
    userCurrent {
      accessList {
        community {
          rawPropertyList(filter: $filter) {
            address
          }
        }
      }
    }
  }
`);

describe('Raw property query', () => {
  const testUtil = new TestUtil();

  beforeAll(async () => {
    await testUtil.initialize();
    await testUtil.database.seed(
      path.join(process.cwd(), '__fixtures__', 'simple-lcra.xlsx')
    );
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('Verify properties that have not been renewed', async () => {
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: {
        filter: {
          nonMemberYearList: [2024],
          memberYearList: [2023],
        },
      },
    });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are members', async () => {
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: {
        filter: {
          memberYearList: [2022],
        },
      },
    });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are NOT members', async () => {
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: {
        filter: {
          nonMemberYearList: [2022],
        },
      },
    });
    expect(result.data).toMatchSnapshot();
  });
});
