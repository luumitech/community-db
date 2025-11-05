import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  TicketAddButton,
  TicketInputTable,
} from '~/community/[communityId]/common/ticket-input-table';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useHookFormContext } from '../../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';

interface EventHeaderProps {
  className?: string;
}

export const EventRowHeader: React.FC<EventHeaderProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'items-center font-semibold text-tiny',
        'rounded-lg px-3',
        className
      )}
      role="row"
    >
      <div role="columnheader">Event</div>
      <div role="columnheader">Event Date</div>
      <div role="columnheader" />
    </div>
  );
};

interface EventRowProps {
  className?: string;
}

export const EventRow: React.FC<EventRowProps> = ({ className }) => {
  const { control } = useHookFormContext();
  const ticketListMethods = useFieldArray({
    control,
    name: 'membership.eventAttended.ticketList',
  });

  return (
    <>
      <div
        className={twMerge(
          'col-span-full mx-3 grid grid-cols-subgrid',
          className
        )}
        role="row"
      >
        <div role="cell">
          <EventNameSelect />
        </div>
        <div role="cell">
          <EventDatePicker />
        </div>
        <div className="flex gap-2 pt-3" role="cell">
          <TicketAddButton onClick={ticketListMethods.append} />
        </div>
      </div>
      <div className="col-span-full">
        <TicketInputTable
          className={cn(
            'rounded-lg border-medium border-divider',
            'ml-[40px] p-1'
          )}
          ticketListConfig={{
            controlNamePrefix: 'membership.eventAttended.ticketList',
            fieldMethods: ticketListMethods,
          }}
          membershipConfig={{
            controlNamePrefix: 'membership',
            canEdit: true,
          }}
        />
      </div>
    </>
  );
};
