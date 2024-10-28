import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  statusCode: number;

  constructor(
    public message: string,
    statusCode?: number,
    /** Original error */
    public original?: unknown
  ) {
    super(message);
    this.statusCode = statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
