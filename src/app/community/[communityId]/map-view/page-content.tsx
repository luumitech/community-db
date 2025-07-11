'use client';
import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { PageProvider } from './page-context';
import { YearSelect } from './year-select';

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: { withGps: true }) {
        id
        address
        lat
        lon
        membershipList {
          year
          isMember
        }
      }
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ className, communityId }) => {
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const result = useQuery(MapView_CommunityQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);

  // Load leaflet dynamically to avoid 'undefined window' error
  const Map = React.useMemo(
    () =>
      dynamic(
        async () => {
          const { MapView } = await import('./map-view');
          return MapView;
        },
        { ssr: false }
      ),
    []
  );

  const community = result.data?.communityFromId;
  if (community == null) {
    return null;
  }

  return (
    <div className={cn(className, 'flex flex-col gap-3')}>
      <YearSelect
        defaultSelectedKeys={selectedYear ? [selectedYear.toString()] : []}
        onSelectionChange={(keys) => {
          const [firstKey] = keys;
          setSelectedYear?.(parseInt(firstKey as string, 10));
        }}
      />
      <PageProvider community={community}>
        <Map className="grow" selectedYear={selectedYear} />
      </PageProvider>
    </div>
  );
};
