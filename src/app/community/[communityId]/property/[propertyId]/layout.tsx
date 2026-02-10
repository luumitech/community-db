'use client';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { LayoutProvider } from './layout-context';

interface Params {
  communityId: string;
  propertyId: string;
}

interface LayoutProps {
  params: Promise<Params>;
  children: React.ReactNode;
  modal: React.ReactNode;
}

const PropertyFromIdQuery = graphql(/* GraphQL */ `
  query propertyFromId($communityId: String!, $propertyId: String!) {
    communityFromId(id: $communityId) {
      id
      ...SendMail_CommunityModifyModal
      propertyFromId(id: $propertyId) {
        id
        updatedAt
        updatedBy {
          ...User
        }
        ...PropertyId_PropertyEditor
        ...PropertyId_MembershipDisplay
        ...PropertyId_MembershipEditor
        ...PropertyId_OccupantDisplay
        ...PropertyId_OccupantEditor
        ...PropertyId_PropertyDisplay
        ...PropertyId_PropertyDelete
      }
    }
  }
`);

export default function PropertyFromIdLayout(props: LayoutProps) {
  const { children, modal } = props;
  const params = React.use(props.params);
  const { communityId, propertyId } = params;
  const result = useQuery(PropertyFromIdQuery, {
    variables: { communityId, propertyId },
    onError,
  });
  const community = result.data?.communityFromId;
  const property = community?.propertyFromId;

  if (!community || !property) {
    return <Skeleton className="h-main-height" />;
  }

  const keyPrefix = `property-${property.id}`;

  return (
    <LayoutProvider community={community} property={property}>
      <React.Fragment key={`${keyPrefix}-children`}>{children}</React.Fragment>
      <React.Fragment key={`${keyPrefix}-modal`}>{modal}</React.Fragment>
    </LayoutProvider>
  );
}
