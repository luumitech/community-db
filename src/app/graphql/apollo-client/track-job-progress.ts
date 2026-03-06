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
}

export async function trackJobProgress(
  client: ApolloClient<object>,
  jobId: string,
  opt?: TrackJobProgressOpt
) {
  return new Promise<void>((resolve, reject) => {
    const sub = client
      .subscribe({
        query: JobProgressSubscription,
        variables: { id: jobId },
      })
      .subscribe({
        next: (result) => {
          const { errors, data } = result;
          if (errors) {
            sub.unsubscribe();
            return reject(new Error(errors[0].message));
          }
          const jobStatus = data?.jobProgress?.job;
          if (jobStatus?.id === jobId) {
            if (jobStatus.progress) {
              const progress = jobStatus.progress / 100;
              opt?.onProgress?.(progress);
            }
            if (jobStatus.hasFailed) {
              return reject(
                new Error(jobStatus.failReason ?? 'An error has occurred')
              );
            }
            if (jobStatus.isComplete) {
              opt?.onProgress?.(1);
              resolve();
            }
          }
        },
        error: (error) => {
          /**
           * This is not expected to happen, so log the error to help diagnose
           * the error
           */
          console.error({ error });
          sub.unsubscribe();
          return reject(error);
        },
        complete: () => {
          sub.unsubscribe();
        },
      });
  });
}
