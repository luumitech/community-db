import React from 'react';
import type { CommunityEntry, MemberCountStat, PropertyEntry } from './_type';

type MemberCountStatFn = (year?: number | null) => MemberCountStat | undefined;
type IsMemberInYearFn = (property: PropertyEntry, year: number) => boolean;

type ContextT = Readonly<{
  community: CommunityEntry;
  propertyCount: number;
  memberCountStat: MemberCountStatFn;
  isMemberInYear: IsMemberInYearFn;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  children: React.ReactNode;
}

export function PageProvider({ community, ...props }: Props) {
  /**
   * Check member count statistic of a given year
   *
   * @param selectedYear Year to check for member
   */
  const memberCountStat = React.useCallback<MemberCountStatFn>(
    (selectedYear) => {
      const stat = community.communityStat.memberCountStat.find(
        ({ year }) => year === selectedYear
      );
      return stat;
    },
    [community]
  );

  /**
   * Check if property has membership for a given year
   *
   * @param entry Property entry
   * @param selectedYear Year to check for member
   */
  const isMemberInYear = React.useCallback<IsMemberInYearFn>(
    (entry, selectedYear) => {
      /**
       * SelectedYear === 0: All properties
       *
       * See: `year-select.tsx`
       */
      if (selectedYear === 0) {
        return true;
      }
      const found = entry.membershipList.find(
        ({ year }) => year === selectedYear
      );
      return !!found?.isMember;
    },
    []
  );

  return (
    <Context.Provider
      value={{
        community,
        propertyCount: community.communityStat.propertyCount,
        memberCountStat,
        isMemberInYear,
      }}
      {...props}
    />
  );
}

export function usePageContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`usePageContext must be used within a PageProvider`);
  }
  return context;
}
