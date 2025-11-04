import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TicketInputTable } from '~/community/[communityId]/common/ticket-input-table';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useHookFormContext, useXtraArgContext } from '../use-hook-form';
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

export const EventRow: React.FC<EventRowProps> = ({ className }) => {
  const { control, getValues, clearErrors } = useHookFormContext();
  const { ticketList } = useXtraArgContext();
  const ticketListMethods = useFieldArray({
    control,
    name: 'event.ticketList',
  });
  const isMember = getValues('hidden.isMember');
  const isFirstEvent = getValues('hidden.isFirstEvent');
  const eventName = getValues('event.eventName');
  const applyToMembership = getValues('hidden.transaction.applyToMembership');

  /**
   * Can select payment method for current transaction if:
   *
   * - Membership fee has been added
   * - At least one ticket has been added
   */
  const canSelectPayment =
    applyToMembership || ticketListMethods.fields.length > 0;

  const onTicketRemove = React.useCallback(
    (ticketIdx: number) => {
      clearErrors('hidden.transaction.paymentMethod');
    },
    [clearErrors]
  );

  return (
    <>
      <div
        className={twMerge(
          'col-span-full mx-3 grid grid-cols-subgrid',
          className
        )}
        role="row"
      >
        <div role="cell" className="pt-1.5 text-sm">
          {eventName}
        </div>
        <div role="cell">
          <EventDatePicker className="max-w-xs" />
        </div>
        <div className="flex gap-2 pt-3" role="cell">
          {/* Ticket Add function will be on the total line */}
          {/* <TicketAddButton onClick={ticketListMethods.append} /> */}
        </div>
      </div>
      <div className="col-span-full">
        <TicketInputTable
          className={cn(
            'rounded-lg border-medium border-divider',
            'ml-[40px] p-1'
          )}
          transactionConfig={{
            controlNamePrefix: 'hidden.transaction',
            ticketList: ticketList ?? [],
            selectPaymentProps: {
              isDisabled: !canSelectPayment,
            },
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
          onRemove={onTicketRemove}
        />
      </div>
    </>
  );
};
