import { cn } from '@heroui/react';
import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const FilterSelect: React.FC<Props> = ({ className }) => {
  const { setValue } = useHookFormContext();

  return (
    <div
      className={cn(
        className,
        'flex flex-col gap-4',
        'items-center sm:items-start'
      )}
    >
      <div className="flex gap-2 items-center">
        <Icon icon="filter" />
        Optional filters to apply:
      </div>
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
      <div>
        <Button
          variant="faded"
          onPress={() => {
            setValue('filter.memberYear', null);
            setValue('filter.nonMemberYear', null);
            setValue('filter.memberEvent', null);
          }}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  );
};
