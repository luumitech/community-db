'use client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { ExportForm } from './export-form';
import { useHookForm } from './use-hook-form';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function ExportXlsx({ params }: RouteArgs) {
  const { communityId } = params;
  const { formMethods } = useHookForm(communityId);
  const { handleSubmit } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-col h-main-height"
        // onSubmit={handleSubmit(onExport)}
      >
        <ExportForm />
      </form>
    </FormProvider>
  );
}
