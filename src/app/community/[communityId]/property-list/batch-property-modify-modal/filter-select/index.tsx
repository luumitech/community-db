import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const FilterSelect: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      Apply changes to all properties who are members in the year:
      <div className="ml-4 flex gap-2 items-center">
        <YearSelect />
      </div>
      <div className="flex gap-2 items-center">
        <Icon icon="filter" />
        Optional filters to apply:
      </div>
      <div className="ml-4 flex gap-2 items-center">
        <EventSelect />
      </div>
    </div>
  );
};
