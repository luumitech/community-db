import { useQuery } from '@apollo/client';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { type DashboardEntry } from './_type';

const DashboardYearlyChartQuery = graphql(/* GraphQL */ `
  query dashboardYearlyChart($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
      }
      ...Dashboard_MembershipSource
      ...Dashboard_EventMembership
      ...Dashboard_EventParticipation
      ...Dashboard_EventTicket
    }
  }
`);

type ContextT = Readonly<{
  communityId: string;
  year: number | null;
  onYearSelect: (year: number) => void;
  community: DashboardEntry | null;
  isLoading: boolean;
  eventSelected: string;
  setEventSelected: (event: string) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  communityId: string;
  children: React.ReactNode;
}

export function PageProvider({ communityId, children, ...props }: Props) {
  const dispatch = useDispatch();
  const { lastEventSelected } = useSelector((state) => state.ui);
  const [eventSelected, setEventSelected] = React.useState(
    lastEventSelected ?? ''
  );
  const { yearSelected } = useSelector((state) => state.ui);
  const onYearSelect = React.useCallback(
    (year: number) => {
      dispatch(actions.ui.setYearSelected(year));
    },
    [dispatch]
  );

  const result = useQuery(DashboardYearlyChartQuery, {
    variables: {
      id: communityId,
      year: yearSelected!,
    },
    skip: yearSelected == null,
    onError,
  });

  const community = result.data?.communityFromId ?? null;

  return (
    <Context.Provider
      value={{
        communityId,
        year: yearSelected,
        onYearSelect,
        community,
        isLoading: !!result.loading,
        eventSelected,
        setEventSelected,
      }}
      {...props}
    >
      {children}
    </Context.Provider>
  );
}

export function usePageContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`usePageContext must be used within a PageProvider`);
  }
  return context;
}
