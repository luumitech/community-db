import { cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from './page-context';

interface Props {
  className?: string;
  selectedYear?: number | null;
}

export const MemberStat: React.FC<Props> = ({ className, selectedYear }) => {
  const { community, memberCountStat, propertyCount } = usePageContext();
  const memberCount = memberCountStat(selectedYear);

  const missingGps = React.useMemo(() => {
    return propertyCount - community.rawPropertyList.length;
  }, [community, propertyCount]);

  return (
    <div className={cn(className, 'flex flex-col')}>
      <span>
        {memberCount?.total ?? 0} / {propertyCount} are members
      </span>
      {missingGps > 0 && (
        <span className="text-warning">
          (warning: {missingGps} properties missing GPS location)
        </span>
      )}
    </div>
  );
};
