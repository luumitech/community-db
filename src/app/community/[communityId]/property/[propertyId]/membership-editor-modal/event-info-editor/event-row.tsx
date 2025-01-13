import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { CurrencyInput } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';
import {
  useHookFormContext,
  type EventAttendedListFieldArray,
} from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { TicketTable } from './ticket-table';

interface EventHeaderProps {
  className?: string;
}

interface EventRowProps {
  className?: string;
  eventAttendedListMethods: EventAttendedListFieldArray;
  yearIdx: number;
  eventIdx: number;
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
      <div role="columnheader" aria-label="Expand Ticket Section" />
      <div role="columnheader">Event</div>
      <div role="columnheader">Event Date</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
      <div role="columnheader" />
    </div>
  );
};

export const EventRow: React.FC<EventRowProps> = ({
  className,
  eventAttendedListMethods,
  yearIdx,
  eventIdx,
}) => {
  const { control, setValue, watch } = useHookFormContext();
  const ticketListMethods = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList`,
  });
  const { fields } = ticketListMethods;
  const expandTicketListEventIdx = watch(
    `hidden.membershipList.${yearIdx}.expandTicketListEventIdx`
  );
  const ticketListIsExpanded = expandTicketListEventIdx === eventIdx;

  const toggleChevron = React.useCallback(() => {
    setValue(
      `hidden.membershipList.${yearIdx}.expandTicketListEventIdx`,
      ticketListIsExpanded ? null : eventIdx
    );
  }, [setValue, eventIdx, ticketListIsExpanded, yearIdx]);

  return (
    <>
      <div
        className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
        role="row"
      >
        <div className="pt-3">
          <motion.div
            className="justify-self-center text-foreground-400"
            role="cell"
            animate={{
              rotate: ticketListIsExpanded ? 90 : 0,
            }}
          >
            <FlatButton
              icon="chevron-forward"
              disabled={fields.length === 0}
              onClick={toggleChevron}
            />
          </motion.div>
        </div>
        <div role="cell">
          <EventNameSelect
            className="max-w-xs"
            yearIdx={yearIdx}
            eventIdx={eventIdx}
          />
        </div>
        <div role="cell">
          <EventDatePicker
            className="max-w-xs"
            yearIdx={yearIdx}
            eventIdx={eventIdx}
          />
        </div>
        <div role="cell">
          {eventIdx === 0 && (
            <CurrencyInput
              controlName={`membershipList.${yearIdx}.price`}
              aria-label="Price"
              allowNegative={false}
              variant="underlined"
            />
          )}
        </div>
        <div role="cell">
          {eventIdx === 0 && (
            <PaymentSelect className="max-w-xs" yearIdx={yearIdx} />
          )}
        </div>
        <div className="flex pt-3 gap-2" role="cell">
          <FlatButton
            className="text-danger"
            icon="trash"
            tooltip="Remove Event"
            onClick={() => {
              eventAttendedListMethods.remove(eventIdx);
              if (eventAttendedListMethods.fields.length === 1) {
                // About to remove last entry, clear paymentMethod/price
                setValue(`membershipList.${yearIdx}.paymentMethod`, null);
                setValue(`membershipList.${yearIdx}.price`, null);
              }
            }}
          />
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
              setValue(
                `hidden.membershipList.${yearIdx}.expandTicketListEventIdx`,
                eventIdx
              );
            }}
          />
        </div>
      </div>
      {fields.length > 0 && (
        <div className="col-span-full">
          <AnimatePresence initial={false}>
            {ticketListIsExpanded && (
              <motion.div
                className="overflow-hidden"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
              >
                <TicketTable
                  className={clsx('border-medium rounded-lg', 'ml-[40px]')}
                  ticketListMethods={ticketListMethods}
                  yearIdx={yearIdx}
                  eventIdx={eventIdx}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
