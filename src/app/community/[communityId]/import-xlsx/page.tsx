'use client';
import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { useJobStatus } from '~/custom-hooks/job-status';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { Form } from '~/view/base/form';
import { toast } from '~/view/base/toastify';
import { MoreMenu } from '../common/more-menu';
import { FirstTimeWizard } from './first-time-wizard';
import { ImportForm } from './import-form';
import { PageProvider } from './page-context';
import { InputData, useHookForm } from './use-hook-form';

const CommunityImportMutation = graphql(/* GraphQL */ `
  mutation communityImport($input: CommunityImportInput!) {
    communityImport(input: $input) {
      id
    }
  }
`);

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ImportXlsx({ params }: RouteArgs) {
  const router = useRouter();
  const client = useApolloClient();
  const { communityId } = params;
  const [importCommunity] = useMutation(CommunityImportMutation);
  const { waitUntilDone } = useJobStatus();
  const { formMethods } = useHookForm(communityId);
  const { handleSubmit } = formMethods;

  const onImport = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;

      const toastId = toast.loading('Importing (Please wait)...');
      try {
        const result = await importCommunity({
          variables: {
            input: {
              ...input,
              // get first file in imported filelist
              xlsx: hidden.importList[0],
            },
          },
        });
        if (result.errors) {
          throw new Error(result.errors[0].message);
        } else if (result.data) {
          const jobId = result.data.communityImport.id;
          await waitUntilDone(jobId, { toastId });
          toast.update(toastId, {
            type: 'success',
            render: 'Imported Successfully',
            progress: undefined,
            isLoading: false,
            closeButton: true,
            autoClose: 5000,
          });
          evictCache(client.cache, 'Community', input.id);
          // Redirect to property list
          router.push(
            appPath('propertyList', { path: { communityId: input.id } })
          );
        }
      } catch (err) {
        toast.update(toastId, {
          type: 'error',
          render: (err as Error).message,
          progress: undefined,
          isLoading: false,
          closeButton: true,
        });
      }
    },
    [importCommunity, router, waitUntilDone, client]
  );

  return (
    <FormProvider {...formMethods}>
      <MoreMenu communityId={communityId} omitKeys={['communityImport']} />
      <PageProvider>
        <Form
          className="flex flex-col h-main-height"
          onSubmit={handleSubmit(onImport)}
        >
          <ImportForm />
        </Form>
        <FirstTimeWizard />
      </PageProvider>
    </FormProvider>
  );
}
