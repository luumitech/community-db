import { Input } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { CurrencyInput } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';
import { useHookFormContext } from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { PaymentSelect } from './payment-select';
import { TicketTable } from './ticket-table';

interface EventHeaderProps {
  className?: string;
}

interface EventRowProps {
  className?: string;
}

export const EventRowHeader: React.FC<EventHeaderProps> = ({ className }) => {
  const { watch } = useHookFormContext();
  const isMember = watch('isMember');

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
      <div role="columnheader">{isMember ? '' : 'Price'}</div>
      <div role="columnheader">{isMember ? '' : 'Payment Method'}</div>
      <div role="columnheader" />
    </div>
  );
};

export const EventRow: React.FC<EventRowProps> = ({ className }) => {
  const { control, watch } = useHookFormContext();
  const ticketListMethods = useFieldArray({
    control,
    name: 'event.ticketList',
  });
  const isMember = watch('isMember');
  const eventName = watch('event.eventName');

  return (
    <>
      <div
        className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
        role="row"
      >
        <div role="cell">
          <Input
            classNames={{
              base: 'opacity-100',
              inputWrapper: 'border-none shadow-none',
            }}
            aria-label="Event Name"
            variant="underlined"
            isDisabled
            value={eventName}
          />
        </div>
        <div role="cell">
          <EventDatePicker className="max-w-xs" />
        </div>
        <div role="cell">
          {!isMember && (
            <CurrencyInput
              controlName="membership.price"
              aria-label="Price"
              allowNegative={false}
              variant="underlined"
            />
          )}
        </div>
        <div role="cell">
          {!isMember && <PaymentSelect className="max-w-xs" />}
        </div>
        <div className="flex pt-3 gap-2" role="cell">
          <FlatButton
            className="text-primary"
            icon="add-ticket"
            tooltip="Add Ticket"
            onClick={() => {
              ticketListMethods.append({
                ticketName: '',
                count: null,
                price: null,
                paymentMethod: null,
              });
            }}
          />
        </div>
      </div>
      {ticketListMethods.fields.length > 0 && (
        <div className="col-span-full">
          <TicketTable
            className={clsx('border-medium rounded-lg', 'ml-[40px]')}
            ticketListMethods={ticketListMethods}
          />
        </div>
      )}
    </>
  );
};
