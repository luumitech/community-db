import queryString, { type StringifiableRecord } from 'query-string';
import * as R from 'remeda';

interface UrlJoinOpt {
  /**
   * List of paths to append to base URL, starting and ending '/' will be taken
   * care of appropriately
   */
  paths?: string | string[];
  query?: StringifiableRecord;
}

/**
 * Joining URL
 *
 * @example
 *
 * ```js
 * const baseURL = 'https://example.com/api/';
 * const fullURL = joinUrl(baseURL, {
 *   paths: ['/users', '123/', 'details'],
 * });
 * console.log(fullURL); // https://example.com/users/123/details
 * ```
 */
export function urlJoin(baseUrl: string, opt?: UrlJoinOpt) {
  const pathList =
    opt?.paths == null ? [] : R.isArray(opt?.paths) ? opt.paths : [opt.paths];
  // Remove starting and ending '/' from path segments
  const trimmedPaths = pathList.map((path) => path.replace(/^\/+|\/+$/g, ''));

  // construct final URL
  return queryString.stringifyUrl({
    url: new URL(trimmedPaths.join('/'), baseUrl).toString(),
    query: opt?.query,
  });
}
