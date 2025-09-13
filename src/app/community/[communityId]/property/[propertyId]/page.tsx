'use client';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { LayoutContent } from './layout-content';

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Property(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId, propertyId } = params;

  // TODO: Move layout-content inline
  return <LayoutContent />;
}
