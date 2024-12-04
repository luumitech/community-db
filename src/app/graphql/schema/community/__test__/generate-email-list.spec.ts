import path from 'path';
import { graphql } from '~/graphql/generated';
import { TestUtil } from '~/graphql/test-util';

describe('Generate Email List', () => {
  const testUtil = new TestUtil();

  beforeAll(async () => {
    await testUtil.initialize();
    await testUtil.database.seed(
      path.join(process.cwd(), '__fixtures__', 'simple.xlsx')
    );
  });

  afterAll(async () => {
    await testUtil.terminate();
  });

  test('Verify properties that have not been renewed', async () => {
    const document = graphql(/* GraphQL */ `
      query GenerateEmailList_NoRenewalPropertyList {
        userCurrent {
          accessList {
            community {
              communityStat {
                noRenewalPropertyList(year: 2024) {
                  address
                  occupantList {
                    email
                  }
                }
              }
            }
          }
        }
      }
    `);

    const result = await testUtil.graphql.executeSingle({ document });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are members', async () => {
    const document = graphql(/* GraphQL */ `
      query GenerateEmailList_EmailMemberPropertyList {
        userCurrent {
          accessList {
            community {
              communityStat {
                memberPropertyList(year: 2022) {
                  address
                  occupantList {
                    email
                  }
                }
              }
            }
          }
        }
      }
    `);

    const result = await testUtil.graphql.executeSingle({ document });
    expect(result.data).toMatchSnapshot();
  });

  test('Verify properties that are NOT members', async () => {
    const document = graphql(/* GraphQL */ `
      query GenerateEmailList_NonMemberPropertyList {
        userCurrent {
          accessList {
            community {
              communityStat {
                nonMemberPropertyList(year: 2022) {
                  address
                  occupantList {
                    email
                  }
                }
              }
            }
          }
        }
      }
    `);

    const result = await testUtil.graphql.executeSingle({ document });
    expect(result.data).toMatchSnapshot();
  });
});
