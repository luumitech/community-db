import clsx from 'clsx';
import React from 'react';
import { TicketInputTable } from '~/community/[communityId]/common/ticket-input-table';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { usePageContext } from '../../page-context';
import { useHookFormContext } from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';

interface EventHeaderProps {
  className?: string;
}

interface EventRowProps {
  className?: string;
}

export const EventRowHeader: React.FC<EventHeaderProps> = ({ className }) => {
  return (
    <div
      className={clsx(
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

export const EventRow: React.FC<EventRowProps> = ({ className }) => {
  const { registerEvent } = usePageContext();
  const { ticketList } = registerEvent;
  const { control, getValues } = useHookFormContext();
  const ticketListMethods = useFieldArray({
    control,
    name: 'event.ticketList',
  });
  const isMember = getValues('hidden.isMember');
  const isFirstEvent = getValues('hidden.isFirstEvent');
  const eventName = getValues('event.eventName');

  return (
    <>
      <div
        className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
        role="row"
      >
        <div role="cell" className="text-sm pt-1.5">
          {eventName}
        </div>
        <div role="cell">
          <EventDatePicker className="max-w-xs" />
        </div>
        <div className="flex pt-3 gap-2" role="cell">
          {/* Ticket Add function will be on the total line */}
          {/* <TicketAddButton onClick={ticketListMethods.append} /> */}
        </div>
      </div>
      <div className="col-span-full">
        <TicketInputTable
          className={clsx(
            'border-medium border-divider rounded-lg',
            'ml-[40px] p-1'
          )}
          transactionConfig={{
            ticketList: ticketList ?? [],
          }}
          ticketListConfig={{
            controlNamePrefix: 'event.ticketList',
            fieldMethods: ticketListMethods,
          }}
          {...(isFirstEvent && {
            membershipConfig: {
              controlNamePrefix: 'membership',
              canEdit: !isMember,
            },
          })}
        />
      </div>
    </>
  );
};
