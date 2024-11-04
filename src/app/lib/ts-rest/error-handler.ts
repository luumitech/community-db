import { TsRestRequest, TsRestResponse } from '@ts-rest/serverless';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { HttpError } from '~/lib/http-error';
import { Logger } from '~/lib/logger';

const logger = Logger('ts-rest/error-handler');

/**
 * Custom default error handling for handling errors within a ts-rest route.
 *
 * See: https://ts-rest.com/docs/serverless/options#custom-error-handler
 */
export function errorHandler(err: unknown, request: TsRestRequest) {
  logger.error(err);
  if (err instanceof HttpError) {
    return TsRestResponse.fromJson(
      { message: err.message, error: err },
      { status: err.statusCode }
    );
  } else if (err instanceof Error) {
    return TsRestResponse.fromJson(
      { message: err.message, error: err },
      { status: StatusCodes.BAD_REQUEST }
    );
  } else {
    const status = StatusCodes.INTERNAL_SERVER_ERROR;
    return TsRestResponse.fromJson(
      { message: getReasonPhrase(status) },
      { status }
    );
  }
}
