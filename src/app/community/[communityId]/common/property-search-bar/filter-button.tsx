import { cn } from '@heroui/react';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { FlatButton } from '~/view/base/flat-button';

interface Props {
  className?: string;
  openDrawer: () => void;
}

export const FilterButton: React.FC<Props> = ({ className, openDrawer }) => {
  const { isFilterSpecified } = useFilterBarContext();

  return (
    <FlatButton
      icon="filter"
      className={cn({
        'text-success': isFilterSpecified,
      })}
      onClick={openDrawer}
    />
  );
};
