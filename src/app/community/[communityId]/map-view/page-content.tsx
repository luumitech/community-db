'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type FilterInputData } from '~/community/[communityId]/common/filter-component';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import Loading from '~/loading';
import { MapContextProvider } from '~/view/base/map';
import { FilterSelect } from './filter-select';
import { MapView } from './map-view';
import { MemberStat } from './member-stat';
import { PageProvider } from './page-context';

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!, $filter: PropertyFilterInput!) {
    communityFromId(id: $id) {
      id
      maxYear
      communityStat {
        propertyCount
        memberCountStat {
          year
          total
        }
      }
      rawPropertyList(filter: $filter) {
        id
        address
        lat
        lon
      }
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ className, communityId }) => {
  const searchBar = useSelector((state) => state.searchBar);
  const [filter, setFilter] = React.useState(searchBar.filter);
  const result = useQuery(MapView_CommunityQuery, {
    variables: {
      id: communityId,
      filter,
    },
    onError,
  });

  const onFilterChange = React.useCallback(
    async (input: FilterInputData) => {
      result.refetch({ id: communityId, filter: input });
      setFilter(input);
    },
    [result, communityId]
  );

  const community = result.data?.communityFromId;
  if (community == null) {
    return <Loading />;
  }

  return (
    <div className={twMerge('flex flex-col gap-3', className)}>
      <PageProvider community={community}>
        <FilterSelect
          filters={filter}
          onFilterChange={onFilterChange}
          description={<MemberStat />}
        />
        <MapContextProvider>
          <MapView className="grow" />
        </MapContextProvider>
      </PageProvider>
    </div>
  );
};
