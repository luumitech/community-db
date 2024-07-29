import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';

export type YearItem = ReturnType<typeof yearSelectItems>[0];

/**
 * Return list of SelectItems that contains every year (increment by 1)
 * using the years in:
 *   - membershipList (in input argument)
 *   - yearToInclude (in input argument)
 *   - currentYear
 *
 * @param membershipList
 * @param yearToInclude
 * @returns selectItems with years in descending order
 */
export function yearSelectItems(
  membershipList: Pick<GQL.Membership, 'year' | 'isMember'>[],
  yearToInclude: string
) {
  const currentYear = getCurrentYear();
  let minYear = Math.min(parseInt(yearToInclude, 10), currentYear);
  let maxYear = Math.max(parseInt(yearToInclude, 10), currentYear);

  membershipList.forEach((entry) => {
    minYear = Math.min(minYear, entry.year);
    maxYear = Math.max(maxYear, entry.year);
  });
  return R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      label: yr.toString(),
      value: yr,
      isMember: !!membershipList.find((entry) => entry.year === yr)?.isMember,
    };
  });
}
