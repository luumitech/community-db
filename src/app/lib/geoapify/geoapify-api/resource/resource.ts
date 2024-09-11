import { GraphQLError } from 'graphql';
import path from 'path';
import { GeoapifyCredential } from '~/lib/geoapify/geoapify-credential';

const DEFAULT_API_VERSION = 'v1';

export abstract class Resource {
  private baseUrl: string;
  private headers: HeadersInit;
  private query: URLSearchParams;

  constructor(credential: GeoapifyCredential) {
    const { apiKey, serverUrl } = credential;
    this.baseUrl = path.join(serverUrl, DEFAULT_API_VERSION);
    this.headers = { 'Content-Type': 'application/json' };
    this.query = new URLSearchParams({ apiKey });
  }

  /**
   * Make call into Geoapify API
   *
   * @param requestPath Geoapify request path (after /v1/...)
   * @param init Arguments to pass into fetch call
   * @returns
   */
  protected async call(
    requestPath: string,
    queryParm: URLSearchParams | null,
    init?: RequestInit
  ) {
    const queryStr = new URLSearchParams({
      ...Object.fromEntries(this.query),
      ...(queryParm && Object.fromEntries(queryParm)),
    }).toString();
    const url = `${path.join(this.baseUrl, requestPath)}?${queryStr}`;
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
