import { DatabaseUtil } from './datatbase-util';
import { GraphQLUtil } from './graphql-util';

/**
 * Helper test utility class for initializaton of key
 * test tools when running Jest unit tests
 */
export class TestUtil {
  public graphql: GraphQLUtil;
  public database: DatabaseUtil;

  constructor() {
    this.graphql = new GraphQLUtil();
    this.database = new DatabaseUtil();
  }

  /**
   * Initialization routine for setting services required to run jest tests
   * - clears and initialize mongodb
   * - setup blob service
   *
   * This is expected to be constructed in `beforeAll` of each test suite
   * to initialize the mongoose connection
   */
  async initialize() {}

  /**
   * Termination routine to clean up services used during jest tests
   *
   * This is expected to be constructed in `afterAll` of each test suite
   * to terminate the mongoose connection
   */
  async terminate() {}

  async seedDatabase(fixturePath: string) {}
}
