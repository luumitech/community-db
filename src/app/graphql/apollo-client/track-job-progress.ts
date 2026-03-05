import { type ApolloClient } from '@apollo/client';
import { graphql } from '~/graphql/generated';

const JobProgressSubscription = graphql(/* GraphQL */ `
  subscription jobProgressSubscription($id: String!) {
    jobProgress(id: $id) {
      job {
        id
        progress
        isComplete
        hasFailed
        failReason
      }
    }
  }
`);

interface TrackJobProgressOpt {
  /**
   * Callback for progress update
   *
   * @param progress Progress from 0-1 (suitable for use in toast)
   */
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function trackJobProgress(
  client: ApolloClient<object>,
  jobId: string,
  opt?: TrackJobProgressOpt
) {
  client
    .subscribe({
      query: JobProgressSubscription,
      variables: { id: jobId },
    })
    .subscribe({
      next: (result) => {
        const { errors, data } = result;
        if (errors) {
          opt?.onError?.(new Error(errors[0].message));
          return;
        }
        const jobStatus = data?.jobProgress?.job;
        if (jobStatus) {
          if (jobStatus.progress) {
            const progress = jobStatus.progress / 100;
            opt?.onProgress?.(progress);
          }
          if (jobStatus.hasFailed) {
            opt?.onError?.(
              new Error(jobStatus.failReason ?? 'An error has occurred')
            );
            return;
          }
          if (jobStatus.isComplete) {
            opt?.onProgress?.(1);
            opt?.onComplete?.();
          }
        }
      },
    });
}
