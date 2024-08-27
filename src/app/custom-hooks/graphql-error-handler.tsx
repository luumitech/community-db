import { ApolloError, QueryResult } from '@apollo/client';
import React from 'react';
import { toast } from '~/view/base/toastify';

type ApolloResult = Pick<QueryResult, 'loading' | 'error'>;

interface ErrorHandlerOptions {
  /**
   * Handle error on your own, if the error is not handled, return it, and it
   * will be handled by the default error handler
   */
  onError?: (err: ApolloError) => ApolloError | undefined | void;
}

/** Handling loading and error coming from graphQL query/mutation */
export function useGraphqlErrorHandler(
  result: ApolloResult,
  opt?: ErrorHandlerOptions
) {
  const { loading, error } = result;

  React.useEffect(() => {
    if (error) {
      if (opt?.onError == null) {
        toast.error(error.message);
      } else {
        const unhandledError = opt.onError(error);
        if (unhandledError) {
          // Default error goes to toast
          toast.error(unhandledError.message);
        }
      }
    }
  }, [error, opt]);
}
