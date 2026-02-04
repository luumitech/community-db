import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { jsonc } from 'jsonc';
import { type StringifiableRecord } from 'query-string';
import { urlJoin } from '~/lib/url-util';
import { type MailchimpCredential } from './_type';

const DEFAULT_API_VERSION = '3.0';

interface CallOpt extends RequestInit {
  query?: StringifiableRecord;
  bodyJson?: object;
}

export class Resource {
  private baseUrl: string;
  private headers: HeadersInit;
  private query: StringifiableRecord;

  constructor(credential: MailchimpCredential) {
    const { apiKey, server } = credential;
    this.baseUrl = `https://${server}.api.mailchimp.com`;
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    this.query = {};
  }

  /**
   * Make call into Mailchimp API
   *
   * @param requestPath Mailchimp request path (after /3.0/...)
   * @param init Arguments to pass into fetch call
   * @returns
   */
  public async call(requestPath: string, opt?: CallOpt) {
    const { query, headers, bodyJson, ...init } = opt ?? {};
    const url = urlJoin(this.baseUrl, {
      paths: [DEFAULT_API_VERSION, requestPath],
      query: { ...this.query, ...query },
    });
    const resp = await fetch(url, {
      headers: { ...this.headers, ...headers },
      ...(bodyJson && { body: jsonc.stringify(bodyJson) }),
      ...init,
    });
    const result = await resp.json();

    switch (resp.status) {
      case StatusCodes.OK:
      case StatusCodes.CREATED:
      case StatusCodes.NO_CONTENT:
        return result;

      default:
        /**
         * Mailchimp error looks like:
         *
         * ```js
         * {
         *   "type": "https://mailchimp.com/developer/marketing/docs/errors/",
         *   "title": "API Key Invalid",
         *   "status": 401,
         *   "detail": "Your request did not include an API key.",
         *   "instance": "e149eedd-4795-8309-cb71-e8f11789caf2"
         * }
         * ```
         */
        const { title, detail } = result;
        throw new GraphQLError(
          `[Mailchimp ${resp.status}] ${title}: ${detail}`
        );
    }
  }

  /**
   * Aggregate all array entries under the specified `listName` and includes
   * only `fields` specified
   */
  public async getAll<T>(
    requestPath: string,
    listName: string,
    fields: (keyof T)[]
  ): Promise<Pick<T, keyof T>[]> {
    const recordPerCall = 1000; // # of records to retrieve per call
    let itemCount = 0; // actual # of items returned this call
    let offset = 0; // offset to start retrieving items
    const result: Pick<T, keyof T>[] = []; // lists to be returned to user

    // List of property names within list to retrieve
    const fieldNames = fields.map((field) => `${listName}.${field as string}`);

    do {
      const resp = await this.call(requestPath, {
        method: 'GET',
        query: {
          fields: [...fieldNames, 'total_items'].join(','),
          offset,
          count: recordPerCall,
        },
      });
      const items = resp[listName] as T[];
      result.push(...items);
      itemCount = items.length;
      offset += itemCount;
    } while (itemCount === recordPerCall);

    return result;
  }
}
