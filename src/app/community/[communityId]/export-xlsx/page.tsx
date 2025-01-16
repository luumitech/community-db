'use client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { MoreMenu } from '../common/more-menu';
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
      <MoreMenu communityId={communityId} omitKeys={['communityExport']} />
      <Form
        className="flex flex-col h-main-height"
        // onSubmit={handleSubmit(onExport)}
      >
        <ExportForm />
      </Form>
    </FormProvider>
  );
}
