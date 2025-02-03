import { cn } from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { useIsFilterSpecified } from './use-hook-form';

interface Props {
  className?: string;
  disclosure: UseDisclosureReturn;
}

export const FilterButton: React.FC<Props> = ({ className, disclosure }) => {
  const { filterSpecified } = useIsFilterSpecified();
  const { onOpen } = disclosure;

  return (
    <FlatButton
      icon="filter"
      className={cn({
        'text-success': filterSpecified,
      })}
      onClick={onOpen}
    />
  );
};
