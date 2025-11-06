import { ApolloError, type ServerError } from '@apollo/client';
import { StatusCodes } from 'http-status-codes';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';

interface OnErrorOpt {
  /**
   * Handle error on your own, if the error is not handled, return it, and it
   * will be handled by the default error handler
   */
  customOnError?: (err: ApolloError) => ApolloError | undefined | void;
}

export function onError(error: ApolloError, opt?: OnErrorOpt) {
  // Handle unauthorized error
  if (error.networkError) {
    const serverError = error.networkError as ServerError;
    const statusCode = serverError?.statusCode;
    if (statusCode === StatusCodes.UNAUTHORIZED) {
      window.location.href = appPath('signIn');
      return;
    }
  }

  if (opt?.customOnError == null) {
    toast.error(error.message);
    return;
  }

  // Custom error handler
  const unhandledError = opt.customOnError(error);
  if (unhandledError) {
    // Default error goes to toast
    toast.error(unhandledError.message);
  }
}
