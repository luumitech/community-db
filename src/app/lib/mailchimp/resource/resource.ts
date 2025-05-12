import { GraphQLError } from 'graphql';
import { type StringifiableRecord } from 'query-string';
import { urlJoin } from '~/lib/url-util';
import { type MailchimpCredential } from './_type';

const DEFAULT_API_VERSION = '3.0';

interface CallOpt extends RequestInit {
  query?: StringifiableRecord;
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
    if (result.status) {
      const { title, detail } = result;
      throw new GraphQLError(`[Mailchimp] ${title}: ${detail}`);
    }

    return result;
  }

  public async getAll(requestPath: string, listName: string, fields: string[]) {
    const recordPerCall = 1000; // # of records to retrieve per call
    let itemCount = 0; // actual # of items returned this call
    let offset = 0; // offset to start retrieving items
    const result = []; // lists to be returned to user

    // List of property names within list to retrieve
    const fieldNames = fields.map((field) => `${listName}.${field}`);

    do {
      const resp = await this.call(requestPath, {
        method: 'GET',
        query: {
          fields: [...fieldNames, 'total_items'].join(','),
          offset,
          count: recordPerCall,
        },
      });
      const items = resp[listName];
      result.push(...items);
      itemCount = items.length;
      offset += itemCount;
    } while (itemCount === recordPerCall);

    return result;
  }
}
