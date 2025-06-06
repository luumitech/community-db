import { GraphQLError } from 'graphql';
import { Resource } from '.';

export class Ping {
  constructor(private res: Resource) {}

  /**
   * A health check for the API that won't return any account-specific
   * information.
   *
   * See: https://mailchimp.com/developer/marketing/api/ping/ping/
   */
  async ping() {
    const output = await this.res.call('ping', { method: 'GET' });

    const { health_status } = output;
    if (health_status !== "Everything's Chimpy!") {
      throw new GraphQLError(health_status);
    }
  }
}
