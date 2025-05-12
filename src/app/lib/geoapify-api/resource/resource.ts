import { GraphQLError } from 'graphql';
import { type StringifiableRecord } from 'query-string';
import { GeoapifyCredential } from '~/lib/geoapify-api/credential';
import { urlJoin } from '~/lib/url-util';

const DEFAULT_API_VERSION = 'v1';

interface CallOpt extends RequestInit {
  query?: StringifiableRecord;
}

export class Resource {
  private baseUrl: string;
  private headers: HeadersInit;
  private query: StringifiableRecord;

  constructor(credential: GeoapifyCredential) {
    const { apiKey, serverUrl } = credential;
    this.baseUrl = serverUrl;
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
  public async call(requestPath: string, opt?: CallOpt) {
    const { query, headers, ...init } = opt ?? {};
    const url = urlJoin(this.baseUrl, {
      paths: [DEFAULT_API_VERSION, requestPath],
      query: { ...this.query, ...query },
    });
    const resp = await fetch(url, {
      headers: { ...this.headers, ...headers },
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
