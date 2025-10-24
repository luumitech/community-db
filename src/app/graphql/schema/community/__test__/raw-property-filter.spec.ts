import path from 'path';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';
import { propertyListPrismaQuery } from '~/lib/prisma-raw-query/property';

const document = graphql(/* GraphQL */ `
  query RawPropertyFilterSpec_RawPropertyList($query: JSONObject!) {
    userCurrent {
      accessList {
        community {
          rawPropertyList(query: $query) {
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
    const query = propertyListPrismaQuery({
      nonMemberYear: 2024,
      memberYear: 2023,
    });
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: { query },
    });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are members', async () => {
    const query = propertyListPrismaQuery({
      memberYear: 2022,
    });
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: { query },
    });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are NOT members', async () => {
    const query = propertyListPrismaQuery({
      nonMemberYear: 2022,
    });
    const result = await testUtil.graphql.executeSingle({
      document,
      variables: { query },
    });
    expect(result.data).toMatchSnapshot();
  });
});
