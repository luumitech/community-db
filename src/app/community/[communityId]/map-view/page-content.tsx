'use client';
import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { propertyListPrismaQuery } from '~/lib/prisma-raw-query/property';
import Loading from '~/loading';
import { MapContextProvider } from '~/view/base/map';
import { MapView } from './map-view';
import { MemberStat } from './member-stat';
import { PageProvider } from './page-context';
import { YearSelect } from './year-select';

// Only list properties with GPS info
const query = propertyListPrismaQuery({ withGps: true });

const MapView_CommunityQuery = graphql(/* GraphQL */ `
  query mapViewCommunity($id: String!, $query: JSONObject!) {
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
      rawPropertyList(query: $query) {
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
    variables: { id: communityId, query },
    onError,
  });

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
        <MapContextProvider>
          <MapView className="grow" selectedYear={yearSelected} />
        </MapContextProvider>
      </PageProvider>
    </div>
  );
};
