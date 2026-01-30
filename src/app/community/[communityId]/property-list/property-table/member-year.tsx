import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from '~/view/base/grid-table';
import type { PropertyEntry } from '../_type';
import { Membership } from './membership';
import { useMemberYear } from './use-member-year';

interface Props {
  className?: string;
  item: PropertyEntry;
  showYearHeader?: boolean;
}

export const MemberYear: React.FC<Props> = ({
  className,
  item,
  showYearHeader,
}) => {
  const yearsToShow = useMemberYear();

  return (
    <div
      className={twMerge(
        /**
         * Force rendering 2 rows (rendering vertically, which allows for
         * possiblities or adding more years in the future)
         *
         * - 1st row shows the years
         * - 2nd row shows membership checkmarks
         */
        'grid auto-cols-fr grid-flow-col grid-rows-[auto_1fr]',
        showYearHeader ? 'row-span-2 grid-rows-[auto_1fr]' : 'grid-rows-1',
        'items-center gap-1',
        className
      )}
    >
      {yearsToShow.map((year) => (
        <React.Fragment key={`${item.id}-${year}`}>
          {showYearHeader && (
            <span
              className={twMerge(
                CLASS_DEFAULT.headerContainer,
                // override default background used in header
                'bg-transparent'
              )}
            >
              {year}
            </span>
          )}
          <Membership fragment={item} year={year} />
        </React.Fragment>
      ))}
    </div>
  );
};
