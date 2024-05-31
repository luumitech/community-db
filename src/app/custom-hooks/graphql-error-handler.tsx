import { QueryResult } from '@apollo/client';
import React from 'react';
import { toast } from 'react-toastify';

type GraphQLResult = Pick<QueryResult, 'loading' | 'error'>;

/**
 * Handling loading and error coming from
 * graphQL query/mutation
 */
export function useGraphqlErrorHandler(result: GraphQLResult) {
  const { loading, error } = result;

  React.useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
}
