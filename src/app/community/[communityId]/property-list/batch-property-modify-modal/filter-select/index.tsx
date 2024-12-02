import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const FilterSelect: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      Apply changes to all properties who are members in the year:
      <YearSelect className="ml-4 w-[180px]" isRequired />
      Optional filters to apply:
      <div className="ml-4 flex gap-2 items-center">
        <Icon icon="filter" />
        <EventSelect className="w-[180px]" />
      </div>
    </div>
  );
};
