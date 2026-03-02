import { cn } from '@heroui/react';
import React from 'react';
import { type OccupancyInfoEntry } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { formatUTCDate, parseAsDate } from '~/lib/date-util';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  occupancyInfo: OccupancyInfoEntry;
  /** Is this household the current occupancy */
  isCurrent: boolean;
  hasError?: boolean;
}

export const ItemLabel: React.FC<Props> = ({
  className,
  occupancyInfo,
  isCurrent,
  hasError,
}) => {
  const { moveInDate, moveOutDate } = occupancyInfo;

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        hasError && 'text-danger',
        className
      )}
    >
      {hasError && <Icon icon="warning" color="danger" />}
      <span>{`${isCurrent ? 'Current' : 'Past'} occupants`}</span>
      <div className="flex items-center gap-0.5 text-xs opacity-70">
        {moveInDate != null && <DateChip dateVal={moveInDate} />}
        {(moveInDate != null || moveOutDate != null) && <span>&#x2013;</span>}
        {moveOutDate != null && <DateChip dateVal={moveOutDate} />}
      </div>
    </div>
  );
};

interface DateChipProps {
  dateVal: string;
}

const DateChip: React.FC<DateChipProps> = ({ dateVal }) => {
  const dateFmt = "MMM''yy";
  const zonedDate = parseAsDate(dateVal);
  const dateStr = zonedDate ? formatUTCDate(zonedDate.toDate(), dateFmt) : null;

  if (!dateStr) {
    return null;
  }
  return dateStr;
};
