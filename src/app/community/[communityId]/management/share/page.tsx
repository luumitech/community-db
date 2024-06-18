'use client';
import { useMutation } from '@apollo/client';
import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function Share({ params }: RouteArgs) {
  const { communityId } = params;

  return <div>share</div>;
}
