import React from 'react';
import type { GeoCoord } from '~/graphql/generated/types';
import { parseAsNumber } from '~/lib/number-util';
import type { CommunityEntry, PropertyEntry } from './_type';

interface PropertyWithGpsEntry extends Pick<PropertyEntry, 'id' | 'address'> {
  loc: L.LatLngTuple;
}

type ContextT = Readonly<{
  community: CommunityEntry;
  /** Total property count */
  propertyCount: number;
  /** Total count of properties matching filter */
  matchPropertyCount: number;
  /** Property matching filters with GPS coordinates */
  matchPropertyWithGps: PropertyWithGpsEntry[];
  /** Hull boundary around properties with GPS */
  hullBoundary: GeoCoord[];
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  children: React.ReactNode;
}

export function PageProvider({ community, ...props }: Props) {
  const matchPropertyWithGps = React.useMemo(() => {
    const result: PropertyWithGpsEntry[] = [];
    community.rawPropertyList.forEach((entry) => {
      const lat = parseAsNumber(entry.lat);
      const lon = parseAsNumber(entry.lon);
      if (lat != null && lon != null) {
        result.push({
          id: entry.id,
          address: entry.address,
          loc: [lat, lon] as L.LatLngTuple,
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
        matchPropertyCount: community.rawPropertyList.length,
        matchPropertyWithGps,
        hullBoundary: community.communityGeo.hullBoundary,
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
