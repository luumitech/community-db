import { useDebounce, useSet } from '@uidotdev/usehooks';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { type CommunityFromIdQueryVariables } from '~/graphql/generated/graphql';

/**
 * Arguments to CommunityFromIdQuery that are specific for filtering property
 * results
 */
type FilterArgType = Pick<
  CommunityFromIdQueryVariables,
  'memberYear' | 'memberEvent' | 'searchText'
>;

type ContextT = Readonly<{
  /** CommunityId (read from route param) */
  communityId: string;
  /** Filter control: membership year */
  year: Set<string>;
  event: Set<string>;

  /** Property filter arguments */
  filterArg: FilterArgType;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  communityId: string;
  children: React.ReactNode;
}

export function FilterBarProvider({ communityId, ...props }: Props) {
  const { communityUi } = useAppContext();
  const year = useSet<string>([]);
  const event = useSet<string>([]);
  const searchText = useDebounce(communityUi.propertyListSearch, 300);

  const [selectedYearStr] = year;
  const [selectedEvent] = event;

  const filterArg = React.useMemo<FilterArgType>(() => {
    const arg: FilterArgType = {};
    if (searchText) {
      arg.searchText = searchText;
    }
    const selectedYear = parseInt(selectedYearStr, 10);
    if (!isNaN(selectedYear)) {
      arg.memberYear = selectedYear;
    }
    if (selectedEvent) {
      arg.memberEvent = selectedEvent;
    }
    return arg;
  }, [searchText, selectedYearStr, selectedEvent]);

  return (
    <Context.Provider
      value={{
        communityId,
        year,
        event,
        filterArg,
      }}
      {...props}
    />
  );
}

export function useFilterBarContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useAppContext must be used within a FilterBarProvider`);
  }
  return context;
}
