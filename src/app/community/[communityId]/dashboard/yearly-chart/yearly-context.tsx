import { useQuery } from '@apollo/client';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
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
  year: number;
  community: DashboardEntry | null;
  isLoading: boolean;
  eventSelected: string;
  setEventSelected: (event: string) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  communityId: string;
  year: number | null;
  children: React.ReactNode;
}

export function YearlyProvider({
  communityId,
  year,
  children,
  ...props
}: Props) {
  const { lastEventSelected } = useSelector((state) => state.ui);
  const [eventSelected, setEventSelected] = React.useState(
    lastEventSelected ?? ''
  );
  const result = useQuery(DashboardYearlyChartQuery, {
    variables: {
      id: communityId,
      year: year!,
    },
    skip: year == null,
    onError,
  });

  if (year == null) {
    return null;
  }

  const community = result.data?.communityFromId ?? null;

  return (
    <Context.Provider
      value={{
        communityId,
        year,
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

export function useYearlyContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useYearlyContext must be used within a YearlyProvider`);
  }
  return context;
}
