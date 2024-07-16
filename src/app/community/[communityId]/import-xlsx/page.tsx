'use client';
import { useMutation } from '@apollo/client';
import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { appLabel, appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { ImportForm } from './import-form';
import {
  CommunityImportMutation,
  InputData,
  useHookForm,
} from './use-hook-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ImportXlsx({ params }: RouteArgs) {
  const { communityId } = params;
  const [importCommunity] = useMutation(CommunityImportMutation);
  const { formMethods } = useHookForm(communityId);
  const { handleSubmit } = formMethods;

  const onImport = React.useCallback(
    (_input: InputData) => {
      const { hidden, ...input } = _input;
      toast.promise(
        importCommunity({
          variables: {
            input: {
              ...input,
              // get first file in imported filelist
              xlsx: hidden.importList[0],
            },
          },
          update: (cache, { data }) => {
            if (data) {
              // Clear cache since the data kept in the previous
              // community is no longer available after import
              const community = data.communityImport;
              evictCache(cache, community.__typename!, community.id);
            }
          },
        }),
        {
          pending: 'Importing...',
          success: {
            render: () => {
              return (
                <div className="flex items-center gap-2">
                  Imported Successfully
                  <Button
                    className="flex-shrink-0"
                    size="sm"
                    as={Link}
                    color="primary"
                    href={appPath('propertyList', { communityId: input.id })}
                  >
                    {appLabel('propertyList')}
                  </Button>
                </div>
              );
            },
          },
        }
      );
    },
    [importCommunity]
  );

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col h-main-height"
        onSubmit={handleSubmit(onImport)}
      >
        <ImportForm />
      </form>
    </FormProvider>
  );
}
