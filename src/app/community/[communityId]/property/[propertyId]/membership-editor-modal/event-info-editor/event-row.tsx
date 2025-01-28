import { Badge } from '@heroui/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import {
  TicketAddButton,
  TicketInputTable,
} from '~/community/[communityId]/common/ticket-input-table';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import {
  useHookFormContext,
  type EventAttendedListFieldArray,
} from '../use-hook-form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { useTicketAccordion } from './use-ticket-acoordion';

interface EventHeaderProps {
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
      <div role="columnheader" aria-label="Expand Ticket Section" />
      <div role="columnheader">Event</div>
      <div role="columnheader">Event Date</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
      <div role="columnheader" />
    </div>
  );
};

interface EventRowProps {
  className?: string;
  eventAttendedListMethods: EventAttendedListFieldArray;
  yearIdx: number;
  eventIdx: number;
}

export const EventRow: React.FC<EventRowProps> = ({
  className,
  eventAttendedListMethods,
  yearIdx,
  eventIdx,
}) => {
  const { control, setValue } = useHookFormContext();
  const { isExpanded, toggle, expand } = useTicketAccordion(yearIdx);
  const membershipPrefix = `membershipList.${yearIdx}` as const;
  const ticketListPrefix =
    `${membershipPrefix}.eventAttendedList.${eventIdx}.ticketList` as const;
  const ticketListMethods = useFieldArray({
    control,
    name: ticketListPrefix,
  });
  const ticketCount = ticketListMethods.fields.length;

  return (
    <>
      <div
        className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
        role="row"
      >
        <FlatButton
          className={clsx('pt-3')}
          disabled={ticketCount === 0}
          onClick={() => toggle(eventIdx)}
        >
          <Badge
            placement="bottom-right"
            size="sm"
            variant="flat"
            content={ticketCount}
          >
            <motion.div
              className="justify-self-center text-foreground-400"
              role="cell"
              animate={{
                rotate: isExpanded(eventIdx) && ticketCount > 0 ? 90 : 0,
              }}
            >
              <Icon icon="chevron-forward" />
            </motion.div>
          </Badge>
        </FlatButton>
        <div role="cell">
          <EventNameSelect yearIdx={yearIdx} eventIdx={eventIdx} />
        </div>
        <div role="cell">
          <EventDatePicker
            className="max-w-xs"
            yearIdx={yearIdx}
            eventIdx={eventIdx}
          />
        </div>
        <div role="cell">
          {eventIdx === 0 && <PriceInput yearIdx={yearIdx} />}
        </div>
        <div role="cell">
          {eventIdx === 0 && <PaymentSelect yearIdx={yearIdx} />}
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
                setValue(`${membershipPrefix}.paymentMethod`, null, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setValue(`${membershipPrefix}.price`, null, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
          <TicketAddButton
            includeHiddenFields
            onClick={(ticket) => {
              ticketListMethods.append(ticket);
              expand(eventIdx);
            }}
          />
        </div>
      </div>
      {ticketListMethods.fields.length > 0 && (
        <div className="col-span-full">
          <AnimatePresence initial={false}>
            {isExpanded(eventIdx) && (
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
                <TicketInputTable
                  className={clsx('border-medium rounded-lg', 'ml-[40px] p-1')}
                  controlNamePrefix={ticketListPrefix}
                  fieldMethods={ticketListMethods}
                  includeHiddenFields
                  onRemove={(ticketIdx: number) => {
                    if (ticketListMethods.fields.length === 1) {
                      // About to remove last entry, collapse ticketList table
                      setValue(
                        `hidden.${membershipPrefix}.expandTicketListEventIdx`,
                        null
                      );
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
