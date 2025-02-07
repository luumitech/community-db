'use client';
import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast, type Id } from '~/view/base/toastify';

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

const DEFAULT_INTERVAL = 3000;

interface WaitUntilDoneOpt {
  /** Toast ID to update progress report */
  toastId?: Id;
  /** Polling interval (in ms) */
  pollInterval?: number;
}

async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper hook for querying job status and poll the status until the job is
 * finished
 */
export function useJobStatus() {
  const [getJobStatus] = useLazyQuery(JobStatusQuery, {
    fetchPolicy: 'network-only',
  });

  const waitUntilDone = React.useCallback(
    async (jobId: string, opt?: WaitUntilDoneOpt) => {
      let isComplete = false;
      do {
        const result = await getJobStatus({ variables: { jobId } });
        if (result.error) {
          throw result.error;
        }
        const jobStatus = result.data?.jobStatus;
        if (jobStatus?.progress && opt?.toastId) {
          const progress = jobStatus.progress / 100;
          // toast autocloses when progress is 1, so only updates progress when it's below 1
          if (progress < 1) {
            toast.update(opt.toastId, { progress });
          }
        }
        if (jobStatus?.hasFailed) {
          throw new Error(jobStatus.failReason ?? 'An error has occurred');
        }
        isComplete = !!jobStatus?.isComplete;
        if (!isComplete) {
          await timeout(opt?.pollInterval ?? DEFAULT_INTERVAL);
        }
      } while (!isComplete);
    },
    [getJobStatus]
  );

  return { waitUntilDone };
}
