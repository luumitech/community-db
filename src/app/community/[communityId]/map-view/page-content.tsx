'use client';
import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import Loading from '~/loading';
import { MemberStat } from './member-stat';
import { PageProvider } from './page-context';
import { YearSelect } from './year-select';

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!) {
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
  const uiYearSelected = useSelector((state) => state.ui.yearSelected);
  const [year, setYear] = React.useState<number>();
  const result = useQuery(MapView_CommunityQuery, {
    variables: { id: communityId },
    onError,
  });

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
    (yr: number) => {
      setYear(yr);
      if (yr > 0) {
        dispatch(actions.ui.setYearSelected(yr));
      }
    },
    [dispatch]
  );

  const yearSelected = React.useMemo(() => {
    return year ?? uiYearSelected;
  }, [year, uiYearSelected]);

  const community = result.data?.communityFromId;
  if (community == null) {
    return <Loading />;
  }

  return (
    <div className={cn(className, 'flex flex-col gap-3')}>
      <PageProvider community={community}>
        <YearSelect
          selectedKeys={yearSelected != null ? [yearSelected.toString()] : []}
          onSelectionChange={(keys) => {
            const [firstKey] = keys;
            const asNum = parseInt(firstKey as string, 10);
            setYearSelected(asNum);
          }}
          description={<MemberStat selectedYear={yearSelected} />}
        />
        <Map className="grow" selectedYear={yearSelected} />
      </PageProvider>
    </div>
  );
};
