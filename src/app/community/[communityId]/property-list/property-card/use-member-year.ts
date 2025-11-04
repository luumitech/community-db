import React from 'react';
import * as R from 'remeda';
import { useSelector } from '~/custom-hooks/redux';
import { getCurrentYear } from '~/lib/date-util';

/**
 * Determine the years to display on each property card
 *
 * - This will return at least one year (i.e. the current year)
 * - It will also sort the years in descending order
 */
export function useMemberYear() {
  const { filterArg } = useSelector((state) => state.searchBar);

  const years = React.useMemo(() => {
    const { memberYear, nonMemberYear } = filterArg;

    const yearsToShow = R.pipe(
      [nonMemberYear ?? getCurrentYear(), memberYear ?? getCurrentYear()],
      R.filter((val): val is number => val != null),
      R.unique(),
      R.sort((a, b) => b - a)
    );

    return yearsToShow;
  }, [filterArg]);

  return years;
}
