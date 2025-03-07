import { useDebounce, useSet } from '@uidotdev/usehooks';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import * as GQL from '~/graphql/generated/graphql';

type ContextT = Readonly<{
  /** CommunityId (read from route param) */
  communityId: string;

  /** Filter control: membership year */
  memberYear: Set<string>;
  nonMemberYear: Set<string>;
  event: Set<string>;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;

  /** Property filter arguments */
  filterArg: GQL.PropertyFilterInput;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  communityId: string;
  children: React.ReactNode;
}

export function FilterBarProvider({ communityId, ...props }: Props) {
  const { communityUi } = useAppContext();
  const memberYear = useSet<string>([]);
  const nonMemberYear = useSet<string>([]);
  const event = useSet<string>([]);
  const searchText = useDebounce(communityUi.propertyListSearch, 300);

  const [selectedMemberYearStr] = memberYear;
  const [selectedNonMemberYearStr] = nonMemberYear;
  const [selectedEvent] = event;

  const isFilterSpecified = React.useMemo(() => {
    return (
      !!selectedMemberYearStr || !!selectedNonMemberYearStr || !!selectedEvent
    );
  }, [selectedMemberYearStr, selectedNonMemberYearStr, selectedEvent]);

  const filterArg = React.useMemo<GQL.PropertyFilterInput>(() => {
    const arg: GQL.PropertyFilterInput = {};
    if (searchText) {
      arg.searchText = searchText;
    }
    const selectedMemberYear = parseInt(selectedMemberYearStr, 10);
    if (!isNaN(selectedMemberYear)) {
      arg.memberYear = selectedMemberYear;
    }
    const selectedNonMemberYear = parseInt(selectedNonMemberYearStr, 10);
    if (!isNaN(selectedNonMemberYear)) {
      arg.nonMemberYear = selectedNonMemberYear;
    }
    if (selectedEvent) {
      arg.memberEvent = selectedEvent;
    }
    return arg;
  }, [
    searchText,
    selectedMemberYearStr,
    selectedNonMemberYearStr,
    selectedEvent,
  ]);

  return (
    <Context.Provider
      value={{
        communityId,
        memberYear,
        nonMemberYear,
        event,
        isFilterSpecified,
        filterArg,
      }}
      {...props}
    />
  );
}

export function useFilterBarContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      `useFilterBarContext must be used within a FilterBarProvider`
    );
  }
  return context;
}
