'use client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { MoreMenu } from '../common/more-menu';
import { PageContent } from './page-content';
import { useHookForm } from './use-hook-form';

export default function CommunityCreate() {
  const formMethods = useHookForm();

  return (
    <FormProvider {...formMethods}>
      <MoreMenu omitKeys={['communityCreate']} />
      <PageContent />
    </FormProvider>
  );
}
