import { GraphQLError } from 'graphql';
import { StatusCodes } from 'http-status-codes';
import { jsonc } from 'jsonc';
import * as R from 'remeda';
import { timeout } from '~/lib/date-util';
import type { GeocodeResult } from './_type';
import { Resource } from './resource';

type BatchSearchFreeFormOutput = GeocodeResult[];
type BatchSearchReverseOutput = GeocodeResult[];

interface BatchOutput {
  id: string;
  status: 'pending';
  url: string;
}

interface JobResultOpt {
  /** Time to wait between polls (in ms), Default 10000 (10 seconds) */
  timeoutMs?: number;
  /**
   * Maximum number of polling attempts. If not specified, then will poll
   * indefinitely until job completes
   */
  maxAttempt?: number;
  /** Callback trigger on each polling attempt */
  onPoll?: (attempt: number) => Promise<void>;
}

interface BatchReverseOpt {
  /** Location type */
  type?:
    | 'country'
    | 'state'
    | 'city'
    | 'postcode'
    | 'street'
    | 'amenity'
    | 'locality'
    | 'building';
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
   *
   * @param url URL to get geocoding result
   * @param timeoutMs Timeout (ms) between polling attempts
   * @param opt Optional configurations
   * @returns
   */
  private async jobResult<T>(url: string, opt?: JobResultOpt) {
    async function repeatUntilSuccess(attempt: number) {
      if (opt?.maxAttempt != null && attempt >= opt.maxAttempt) {
        throw new GraphQLError(
          `Request did not complete after ${opt.maxAttempt} attempts`
        );
      }

      await opt?.onPoll?.(attempt + 1);
      const resp = await fetch(url);
      switch (resp.status) {
        case StatusCodes.OK: {
          const result = await resp.json();
          return result as T;
        }
        case StatusCodes.ACCEPTED:
          // Job is still running, check result later
          await timeout(opt?.timeoutMs ?? 10000);
          return repeatUntilSuccess(attempt + 1);
        default:
          throw new GraphQLError(`Error: ${resp.statusText}`);
      }
    }

    /**
     * Wait a second to give a chance for the initial batch request do its
     * thing, then poll for completion status
     */
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
  async searchFreeForm(
    textList: string[],
    /** Progress from 0-100 */
    onProgress?: (progress: number) => Promise<void>
  ) {
    if (textList.length === 0) {
      onProgress?.(100);
      return [];
    }

    await onProgress?.(0);
    const result: BatchSearchFreeFormOutput = [];

    /**
     * Estimate attempts it takes to complete the request. We assume each poll
     * can process 100 addresses.
     */
    const estimateAttempt = Math.ceil(textList.length / 100);
    let attempt = 1;

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
        {
          timeoutMs: 10000,
          onPoll: async () => {
            const progress =
              attempt < estimateAttempt
                ? attempt / estimateAttempt
                : attempt / (attempt + 1);
            attempt++;
            await onProgress?.(progress * 100);
          },
        }
      );
      result.push(...jobResult);
    }

    await onProgress?.(100);
    return result;
  }

  /**
   * The Geocoder API accepts both structured and free-form addresses as an
   * input and returns JSON, GeoJSON, and XML objects as a response. In
   * addition, you can specify location filters and preferred geographical areas
   * to make the address search more accurate and focused.
   *
   * See: https://apidocs.geoapify.com/docs/geocoding/batch/#api-reverse
   */
  async searchReverse(
    locList: L.LatLng[],
    opt?: BatchReverseOpt,
    /** Progress from 0-100 */
    onProgress?: (progress: number) => Promise<void>
  ) {
    if (locList.length === 0) {
      onProgress?.(100);
      return [];
    }

    await onProgress?.(0);
    const result: BatchSearchReverseOutput = [];

    /**
     * Estimate attempts it takes to complete the request. We assume each poll
     * can process 100 locations.
     */
    const estimateAttempt = Math.ceil(locList.length / 100);
    let attempt = 1;

    // geoapify batch call limits 1000 locations per call
    const MAX_LOC = 1000;
    const locChunk = R.chunk(locList, MAX_LOC);
    for (const [idx, chunk] of locChunk.entries()) {
      const body = chunk.map((loc) => [loc.lng, loc.lat]);
      const batchOutput = await this.res.call<BatchOutput>(
        'batch/geocode/reverse',
        {
          method: 'POST',
          body: jsonc.stringify(body),
          ...(opt != null && { query: { ...opt } }),
        }
      );

      const jobResult = await this.jobResult<BatchSearchReverseOutput>(
        batchOutput.url,
        {
          timeoutMs: 10000,
          onPoll: async () => {
            const progress =
              attempt < estimateAttempt
                ? attempt / estimateAttempt
                : attempt / (attempt + 1);
            attempt++;
            await onProgress?.(progress * 100);
          },
        }
      );
      result.push(...jobResult);
    }

    await onProgress?.(100);
    return result;
  }
}
