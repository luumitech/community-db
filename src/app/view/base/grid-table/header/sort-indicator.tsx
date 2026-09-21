import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import type { SortDirection } from '../_type';

interface Props {
  className?: string;
  sortDirection: SortDirection | null;
}

export const SortIndicator: React.FC<Props> = ({
  className,
  sortDirection,
}) => {
  if (!sortDirection) {
    return <Icon className={className} icon="sortNone" />;
  }

  return (
    <Icon
      className={className}
      icon={sortDirection === 'ascending' ? 'sortAsc' : 'sortDesc'}
    />
  );
};
