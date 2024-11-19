'use client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
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
      <Form
        className="flex flex-col h-main-height"
        // onSubmit={handleSubmit(onExport)}
      >
        <ExportForm />
      </Form>
    </FormProvider>
  );
}
