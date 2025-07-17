import { cn } from '@heroui/react';
import React from 'react';
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
      className={cn(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
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
        className={cn(className, 'grid col-span-full grid-cols-subgrid mx-3')}
        role="row"
      >
        <div role="cell">
          <EventNameSelect />
        </div>
        <div role="cell">
          <EventDatePicker />
        </div>
        <div className="flex pt-3 gap-2" role="cell">
          <TicketAddButton onClick={ticketListMethods.append} />
        </div>
      </div>
      <div className="col-span-full">
        <TicketInputTable
          className={cn(
            'border-medium border-divider rounded-lg',
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
