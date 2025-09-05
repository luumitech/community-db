'use client';
import { useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { useJobStatus } from '~/custom-hooks/job-status';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { ModifyModal } from './modify-modal';
import { ToastHelper } from './toast-helper';
import { InputData } from './use-hook-form';

const BatchPropertyMutation = graphql(/* GraphQL */ `
  mutation batchPropertyModify($input: BatchPropertyModifyInput!) {
    batchPropertyModify(input: $input) {
      id
    }
  }
`);

export default function BatchPropertyModify() {
  const client = useApolloClient();
  const [updateProperty] = useMutation(BatchPropertyMutation);
  const { waitUntilDone } = useJobStatus();

  const onSave = React.useCallback(
    async (input: InputData) => {
      const toastHelper = new ToastHelper();
      try {
        const result = await updateProperty({
          variables: { input },
        });
        if (result.errors) {
          throw new Error(result.errors[0].message);
        } else if (result.data) {
          const jobId = result.data.batchPropertyModify.id;
          await waitUntilDone(jobId, {
            cb: (progress) => toastHelper.updateProgress(progress),
          });
          evictCache(client.cache, 'Community', input.self.id);
          evictCache(client.cache, 'CommunityStat', input.self.id);
        }
      } catch (err) {
        const errMsg =
          err instanceof Error ? (
            <div className="whitespace-pre-wrap overflow-auto max-h-[200px]">
              {err.message}
            </div>
          ) : (
            'Unknown error'
          );
        toastHelper.updateError(errMsg);
      }
    },
    [client, updateProperty, waitUntilDone]
  );

  return <ModifyModal onSave={onSave} />;
}
