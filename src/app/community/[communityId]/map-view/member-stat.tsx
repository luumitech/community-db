import { cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from './page-context';

interface Props {
  className?: string;
  selectedYear?: number | null;
}

export const MemberStat: React.FC<Props> = ({ className, selectedYear }) => {
  const { propertyWithGps, memberCountStat, propertyCount } = usePageContext();

  const missingGps = React.useMemo(() => {
    return propertyCount - propertyWithGps.length;
  }, [propertyWithGps, propertyCount]);

  const description = React.useMemo(() => {
    switch (selectedYear) {
      case 0:
        /**
         * SelectedYear === 0: All properties
         *
         * See: `year-select.tsx`
         */
        return `${propertyCount} properties`;
      default: {
        const memberCount = memberCountStat(selectedYear);
        return `${memberCount?.total ?? 0} / ${propertyCount} are
          members`;
      }
    }
  }, [memberCountStat, propertyCount, selectedYear]);

  return (
    <div className={cn(className, 'flex flex-col')}>
      <span>{description}</span>
      {propertyWithGps.length > 0 && missingGps > 0 && (
        <span className="text-warning">
          (warning: {missingGps} properties missing GPS location)
        </span>
      )}
    </div>
  );
};
