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
        // 64px is height of header bar
        // 0.5rem is the top padding within <main/>, see layout.tsx
        className="flex flex-col h-[calc(100vh_-_64px_-_0.5rem)]"
        // onSubmit={handleSubmit(onExport)}
      >
        <ExportForm />
      </form>
    </FormProvider>
  );
}
