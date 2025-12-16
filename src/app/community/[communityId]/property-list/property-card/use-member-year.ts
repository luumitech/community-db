import React from 'react';
import * as R from 'remeda';
import { useSelector } from '~/custom-hooks/redux';
import { getCurrentYear } from '~/lib/date-util';

/**
 * Determine the years to display on each property card
 *
 * - This will return 2 values
 * - Default current year and previous year
 * - Will use filter memberYear/nonMemberYear values, if specified
 * - It will also sort the years in descending order
 */
export function useMemberYear() {
  const { filterArg } = useSelector((state) => state.searchBar);

  const years = React.useMemo(() => {
    const { memberYearList, nonMemberYear } = filterArg;

    const yearsToShow = new Set<number>();
    if (memberYearList != null) {
      memberYearList.forEach(yearsToShow.add);
    }
    if (nonMemberYear != null) {
      yearsToShow.add(nonMemberYear);
    }
    if (yearsToShow.size < 2) {
      yearsToShow.add(getCurrentYear());
    }
    if (yearsToShow.size < 2) {
      yearsToShow.add(getCurrentYear() - 1);
    }
    const sortedYearsToShow = R.pipe(
      [...yearsToShow],
      R.sort((a, b) => b - a)
    );

    return sortedYearsToShow;
  }, [filterArg]);

  return years;
}
