'use client';
import { useLazyQuery, useQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';

const JobStatusQuery = graphql(/* GraphQL */ `
  query jobStatus($jobId: String!) {
    jobStatus(id: $jobId) {
      id
      progress
      isComplete
      hasFailed
      failReason
    }
  }
`);

async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useJobStatus() {
  const [getJobStatus] = useLazyQuery(JobStatusQuery, {
    fetchPolicy: 'network-only',
  });

  const startPolling = React.useCallback(
    async (jobId: string, ms = 3000) => {
      let isComplete = false;
      while (!isComplete) {
        await timeout(ms);
        const result = await getJobStatus({ variables: { jobId } });
        const jobStatus = result.data?.jobStatus;
        if (jobStatus?.hasFailed) {
          throw new Error(jobStatus.failReason ?? 'An error has occurred.');
        }
        isComplete = !!jobStatus?.isComplete;
      }
    },
    [getJobStatus]
  );

  return { startPolling };
}
