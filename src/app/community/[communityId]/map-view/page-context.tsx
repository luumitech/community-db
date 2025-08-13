import React from 'react';
import { parseAsNumber } from '~/lib/number-util';
import type { CommunityEntry, MemberCountStat, PropertyEntry } from './_type';

type MemberCountStatFn = (year?: number | null) => MemberCountStat | undefined;

interface PropertyWithGpsEntry extends Pick<PropertyEntry, 'id' | 'address'> {
  loc: L.LatLngTuple;
  isMemberInYear: (year: number) => boolean;
}

type ContextT = Readonly<{
  community: CommunityEntry;
  propertyWithGps: PropertyWithGpsEntry[];
  propertyCount: number;
  memberCountStat: MemberCountStatFn;
}>;

/**
 * Check if property has membership for a given year
 *
 * @param entry Property entry
 * @param selectedYear Year to check for member
 */
function isMemberInYear(entry: PropertyEntry, selectedYear: number) {
  /**
   * SelectedYear === 0: All properties
   *
   * See: `year-select.tsx`
   */
  if (selectedYear === 0) {
    return true;
  }
  const found = entry.membershipList.find(({ year }) => year === selectedYear);
  return !!found?.isMember;
}

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

  const propertyWithGps = React.useMemo(() => {
    const result: PropertyWithGpsEntry[] = [];
    community.rawPropertyList.forEach((entry) => {
      const lat = parseAsNumber(entry.lat);
      const lon = parseAsNumber(entry.lon);
      if (lat != null && lon != null) {
        result.push({
          id: entry.id,
          address: entry.address,
          loc: [lat, lon] as L.LatLngTuple,
          isMemberInYear: (year: number) => isMemberInYear(entry, year),
        });
      }
    });
    return result;
  }, [community]);

  return (
    <Context.Provider
      value={{
        community,
        propertyCount: community.communityStat.propertyCount,
        memberCountStat,
        propertyWithGps,
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
