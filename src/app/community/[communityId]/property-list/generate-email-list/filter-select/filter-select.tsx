import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const FilterSelectImpl: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex gap-2 items-center">
        <Icon icon="filter" />
        Optional filters to apply:
      </div>
      <div className="ml-4 flex flex-col gap-2 items-start">
        <YearSelect
          controlName="filter.memberYear"
          label="Member In Year"
          description="Include only members who have memberships in the specified year"
          autoFocus
        />
        <YearSelect
          controlName="filter.nonMemberYear"
          label="Non-Member In Year"
          description="Exclude members who have memberships in the specified year"
        />
        <EventSelect />
      </div>
    </div>
  );
};
