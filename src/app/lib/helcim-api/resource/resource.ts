import { StatusCodes } from 'http-status-codes';
import { HttpError } from '~/lib/http-error';
import { HelcimCredential } from '../credential';

export interface CallArg {
  header?: Record<string, unknown>;
  body?: Record<string, unknown>;
}

export class Resource {
  constructor(public credential: HelcimCredential) {}

  async call(path: string, method: string, arg?: CallArg) {
    const { serverUrl, apiKey } = this.credential;
    const res = await fetch(`${serverUrl}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        cache: 'no-cache',
        'api-token': apiKey,
        ...arg?.header,
      },
      ...(arg?.body && { body: JSON.stringify(arg.body) }),
    });

    // Handle error condition returned from JSON-RPC call
    const json = await res.json();

    if (json.errors) {
      throw new HttpError(
        JSON.stringify(json.errors, null, 2),
        StatusCodes.BAD_REQUEST,
        json.errors
      );
    }
    return json;
  }
}
