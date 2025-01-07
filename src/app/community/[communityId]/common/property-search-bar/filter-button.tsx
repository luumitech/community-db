import { type UseDisclosureReturn } from '@nextui-org/use-disclosure';
import clsx from 'clsx';
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
      className={clsx({
        'text-success': filterSpecified,
      })}
      onClick={onOpen}
    />
  );
};
