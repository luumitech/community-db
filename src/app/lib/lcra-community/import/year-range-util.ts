import { type Membership } from '@prisma/client';
import { getCurrentYear } from '~/lib/date-util';

export interface Property {
  membershipList: Pick<Membership, 'year'>[];
}

/**
 * Process property list and find the minimum and maximum years represented in
 * all the properties
 */
export function extractYearRange(propertyList: Property[]) {
  let minYear = Infinity;
  let maxYear = -Infinity;
  propertyList.forEach(({ membershipList }) => {
    // For each property, go through all membership information
    // to determine min/max year
    membershipList.forEach((entry) => {
      minYear = Math.min(minYear, entry.year);
      maxYear = Math.max(maxYear, entry.year);
    });
  });
  if (!isFinite(minYear)) {
    minYear = getCurrentYear();
  }
  if (!isFinite(maxYear)) {
    maxYear = getCurrentYear();
  }

  return { minYear, maxYear };
}
