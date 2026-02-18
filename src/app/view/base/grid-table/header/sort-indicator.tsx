import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import type { SortDirection } from '../_type';

interface Props {
  sortDirection: SortDirection | null;
}

export const SortIndicator: React.FC<Props> = ({ sortDirection }) => {
  if (!sortDirection) {
    return <Icon icon="sortNone" />;
  }

  return <Icon icon={sortDirection === 'ascending' ? 'sortAsc' : 'sortDesc'} />;
};
