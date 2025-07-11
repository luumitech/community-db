import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { jsonc } from 'jsonc';
import * as R from 'remeda';
import { timeout } from '~/lib/date-util';
import type { GeocodeResult } from './_type';
import { Resource } from './resource';

type BatchSearchFreeFormOutput = GeocodeResult[];

interface BatchOutput {
  id: string;
  status: 'pending';
  url: string;
}

export class BatchGeocode {
  constructor(private res: Resource) {}

  /**
   * When you need to transform a large number of addresses into geographic
   * coordinates programmatically, you can use a Batch Geocoding API.
   *
   * Batch Geocoding API is similar to our standard geocoding service, with one
   * big difference. Rather than sending multiple requests, you geocode a list
   * of addresses in one request.
   *
   * See: https://apidocs.geoapify.com/docs/geocoding/batch/#about
   */
  private async jobResult<T>(
    url: string,
    timeoutMs: number,
    maxAttempt?: number
  ) {
    async function repeatUntilSuccess(attempt: number) {
      if (maxAttempt != null && attempt >= maxAttempt) {
        throw new GraphQLError('Tried too many attempts');
      }

      const resp = await fetch(url);
      switch (resp.status) {
        case StatusCodes.OK: {
          const result = await resp.json();
          return result as T;
        }
        case StatusCodes.ACCEPTED:
          // Job is still running, check result later
          await timeout(timeoutMs);
          return repeatUntilSuccess(attempt + 1);
        default:
          throw new GraphQLError(`Error: ${resp.statusText}`);
      }
    }

    // Wait a second to give a chance for the batch request do its thing, then check for result
    await timeout(1000);
    return repeatUntilSuccess(0);
  }

  /**
   * The Geocoder API accepts both structured and free-form addresses as an
   * input and returns JSON, GeoJSON, and XML objects as a response. In
   * addition, you can specify location filters and preferred geographical areas
   * to make the address search more accurate and focused.
   *
   * See: https://apidocs.geoapify.com/docs/geocoding/batch/#api
   */
  async searchFreeForm(textList: string[]) {
    if (textList.length === 0) {
      return [];
    }

    const result: BatchSearchFreeFormOutput = [];

    // geoapify batch call limits 1000 address per call
    const MAX_ADDR = 1000;
    const addressChunk = R.chunk(textList, MAX_ADDR);
    for (const [idx, chunk] of addressChunk.entries()) {
      const batchOutput = await this.res.call<BatchOutput>(
        'batch/geocode/search',
        {
          method: 'POST',
          body: jsonc.stringify(chunk),
        }
      );

      const jobResult = await this.jobResult<BatchSearchFreeFormOutput>(
        batchOutput.url,
        10000
      );
      result.push(...jobResult);
    }

    return result;
  }
}
