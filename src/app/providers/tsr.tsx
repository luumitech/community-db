import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { initTsrReactQuery, isFetchError } from '@ts-rest/react-query/v5';
import React from 'react';
import { contract } from '~/api/contract';
import { toast } from '~/view/base/toastify';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: '',
});

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (err) => {
      if (isFetchError(err)) {
        toast.error(`Network error: ${err.message}`);
        return;
      }

      /**
       * All error has a body with message
       *
       * See: src/app/api/contract.ts
       */
      // @ts-expect-error all error expects to have message
      toast.error(err.body.message);
    },
  }),
});

interface Props {}

export const TsrProviders: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
};
