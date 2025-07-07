'use client';
import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { timeout } from '~/lib/date-util';

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
  /** Polling interval (in ms) */
  pollInterval?: number;
  /** Job status progress (0-1) */
  cb?: (progress: number) => void;
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
        if (jobStatus?.progress && opt?.cb) {
          const progress = jobStatus.progress / 100;
          opt.cb(progress);
        }
        if (jobStatus?.hasFailed) {
          throw new Error(jobStatus.failReason ?? 'An error has occurred');
        }
        isComplete = !!jobStatus?.isComplete;
        if (!isComplete) {
          await timeout(opt?.pollInterval ?? DEFAULT_INTERVAL);
        } else {
          // Update progress to indicate completion of task
          opt?.cb?.(1);
        }
      } while (!isComplete);
    },
    [getJobStatus]
  );

  return { waitUntilDone };
}
