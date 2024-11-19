import { GraphQLError } from 'graphql';
import path from 'path';
import queryString, { type StringifiableRecord } from 'query-string';
import { GeoapifyCredential } from '~/lib/geoapify-api/credential';

const DEFAULT_API_VERSION = 'v1';

export class Resource {
  private baseUrl: string;
  private headers: HeadersInit;
  private query: StringifiableRecord;

  constructor(credential: GeoapifyCredential) {
    const { apiKey, serverUrl } = credential;
    this.baseUrl = path.join(serverUrl, DEFAULT_API_VERSION);
    this.headers = { 'Content-Type': 'application/json' };
    this.query = { apiKey };
  }

  /**
   * Make call into Geoapify API
   *
   * @param requestPath Geoapify request path (after /v1/...)
   * @param init Arguments to pass into fetch call
   * @returns
   */
  public async call(
    requestPath: string,
    queryParm: StringifiableRecord | null,
    init?: RequestInit
  ) {
    const url = queryString.stringifyUrl({
      url: `${path.join(this.baseUrl, requestPath)}`,
      query: {
        ...this.query,
        ...queryParm,
      },
    });
    const resp = await fetch(url, {
      headers: { ...this.headers, ...init?.headers },
      ...init,
    });
    const result = await resp.json();
    /**
     * Geoapify error looks like:
     *
     * ```js
     * {
     *   "statusCode": 401,
     *   "error": "Unauthorized",
     *   "message": "Invalid apiKey"
     * }
     * ```
     */
    if (result.statusCode) {
      const { error, message } = result;
      throw new GraphQLError(`${error}: ${message}`);
    }

    return result;
  }
}
