'use client';
import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { getCurrentYear } from '~/lib/date-util';
import { PageProvider } from './page-context';
import { YearSelect } from './year-select';

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!) {
    communityFromId(id: $id) {
      id
      maxYear
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
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);
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

  const setYearSelected = React.useCallback(
    (year: string | number) => {
      dispatch(actions.ui.setYearSelected(year));
    },
    [dispatch]
  );

  const community = result.data?.communityFromId;

  React.useEffect(() => {
    if (community && yearSelected == null) {
      // By default, show current year (unless it's not available)
      setYearSelected(Math.min(getCurrentYear(), community.maxYear));
    }
  }, [community, yearSelected, setYearSelected]);

  if (community == null) {
    return null;
  }

  return (
    <div className={cn(className, 'flex flex-col gap-3')}>
      <YearSelect
        selectedKeys={yearSelected ? [yearSelected.toString()] : []}
        onSelectionChange={(keys) => {
          const [firstKey] = keys;
          setYearSelected(firstKey);
        }}
      />
      <PageProvider community={community}>
        <Map className="grow" selectedYear={yearSelected} />
      </PageProvider>
    </div>
  );
};
