'use client';
import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { genUploader } from 'uploadthing/client';
import type { UploadRouter } from '~/api/uploadthing/uploadthing';
import { FormProvider } from '~/custom-hooks/hook-form';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { trackJobProgress } from '~/graphql/apollo-client/track-job-progress';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { Form } from '~/view/base/form';
import { MoreMenu } from '../common/more-menu';
import { FirstTimeWizard } from './first-time-wizard';
import { ImportForm } from './import-form';
import { PageProvider } from './page-context';
import { ToastHelper } from './toast-helper';
import { InputData, useHookForm } from './use-hook-form';

const { uploadFiles } = genUploader<UploadRouter>();

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
  params: Promise<Params>;
}

export default function ImportCommunity(props: RouteArgs) {
  const params = React.use(props.params);
  const router = useRouter();
  const client = useApolloClient();
  const { communityId } = params;
  const [importCommunity] = useMutation(CommunityImportMutation);
  const { formMethods } = useHookForm(communityId);
  const { handleSubmit } = formMethods;

  const onImport = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;

      const toastHelper = new ToastHelper(input.method);

      const handleError = (err: unknown) => {
        const errMsg =
          err instanceof Error ? (
            <div className="max-h-[200px] overflow-auto whitespace-pre-wrap">
              {err.message}
            </div>
          ) : (
            'Unknown error'
          );
        toastHelper.updateError(errMsg);
      };

      try {
        let xlsx: GQL.UploadthingInput | undefined;
        if (input.method === 'xlsx') {
          const uploadResult = await uploadFiles('xlsx', {
            files: hidden.importList,
            onUploadProgress: (arg) => {
              toastHelper.updateUploadProgress({
                loaded: arg.loaded,
                size: arg.file.size,
              });
            },
          });
          // Make an assumation that only one file is uploaded
          // Since FileInput only accepts one file
          // So only need to process first entry into uploadResult
          const [{ ufsUrl, key }] = uploadResult;
          xlsx = { ufsUrl, key };
        }
        const result = await importCommunity({
          variables: {
            input: {
              ...input,
              xlsx,
            },
          },
        });
        if (result.errors) {
          throw new Error(result.errors[0].message);
        } else if (result.data) {
          const jobId = result.data.communityImport.id;
          await trackJobProgress(client, jobId, {
            onProgress: (progress) =>
              toastHelper.updateImportProgress({ progress }),
            onError: (msg) => handleError(msg),
            onComplete: () => {
              evictCache(client.cache, 'Community', input.id);
              // Redirect to property list
              router.push(
                appPath('propertyList', {
                  path: { communityId: input.id },
                })
              );
            },
          });
        }
      } catch (err) {
        handleError(err);
      }
    },
    [importCommunity, router, client]
  );

  return (
    <FormProvider {...formMethods}>
      <MoreMenu omitKeys={['communityImport']} />
      <PageProvider>
        <Form
          className="flex h-main-height flex-col"
          onSubmit={handleSubmit(onImport)}
        >
          <ImportForm />
        </Form>
        <FirstTimeWizard />
      </PageProvider>
    </FormProvider>
  );
}
