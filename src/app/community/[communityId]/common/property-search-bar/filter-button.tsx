import clsx from 'clsx';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { FlatButton } from '~/view/base/flat-button';

interface Props {
  className?: string;
}

export const FilterButton: React.FC<Props> = ({ className }) => {
  const { drawerDisclosure, filterSpecified } = useFilterBarContext();
  const { onOpen } = drawerDisclosure;

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
