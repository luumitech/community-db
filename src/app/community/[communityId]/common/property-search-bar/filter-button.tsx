import { cn } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { FlatButton } from '~/view/base/flat-button';

interface Props {
  className?: string;
  openDrawer: () => void;
}

export const FilterButton: React.FC<Props> = ({ className, openDrawer }) => {
  const { isFilterSpecified } = useSelector((state) => state.searchBar);

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
