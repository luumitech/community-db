'use client';
import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { toast } from 'react-toastify';
import { FormProvider } from '~/custom-hooks/hook-form';
import { importCommunity } from '~/server-action/import-community';
import { ImportForm } from './import-form';
import { InputData, useHookForm } from './use-hook-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ImportXlsx({ params }: RouteArgs) {
  const { communityId } = params;
  const { formMethods } = useHookForm(communityId);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { handleSubmit } = formMethods;

  const onImport = React.useCallback(
    (form: InputData) => {
      toast.promise(
        async () => {
          if (formRef.current) {
            const formData = new FormData(formRef.current);
            await importCommunity(formData);
          }
        },
        {
          pending: 'Importing...',
          success: {
            render: () => {
              return (
                <div className="flex items-center gap-2">
                  Imported Successfully!
                  <Button
                    size="sm"
                    as={Link}
                    color="primary"
                    href={`/community/${communityId}/editor/property-list`}
                  >
                    View
                  </Button>
                </div>
              );
            },
          },
          error: {
            render: ({ data }) => {
              if (data instanceof Error) {
                return data.message;
              } else {
                return 'Import Failed';
              }
            },
          },
        }
      );
    },
    [communityId]
  );

  return (
    <FormProvider {...formMethods}>
      <form
        // 64px is height of header bar
        // 0.5rem is the top padding within <main/>, see layout.tsx
        className="flex flex-col h-[calc(100vh_-_64px_-_0.5rem)]"
        ref={formRef}
        onSubmit={handleSubmit(onImport)}
      >
        <ImportForm />
      </form>
    </FormProvider>
  );
}
