import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';

export interface YearChipProps extends ChipProps {
  className?: string;
  year: string;
  isMember: boolean;
  showIcon?: boolean;
}

export const YearChip: React.FC<YearChipProps> = ({
  className,
  year,
  isMember,
  showIcon,
  ...props
}) => {
  return (
    <Chip
      className={className}
      radius="sm"
      variant="bordered"
      color={isMember ? 'success' : 'default'}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {year}
        {!!showIcon && (
          <Icon icon={isMember ? 'thumb-up' : 'thumb-down'} size={16} />
        )}
      </div>
    </Chip>
  );
};
