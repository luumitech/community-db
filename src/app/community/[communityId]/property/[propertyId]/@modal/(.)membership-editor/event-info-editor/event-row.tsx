import { Badge, cn } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import * as R from 'remeda';
import { TicketInputTable } from '~/community/[communityId]/common/ticket-input-table';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
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
        'col-span-full grid grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'items-center text-tiny font-semibold',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader" aria-label="Expand Ticket Section" />
      <div role="columnheader">Event</div>
      <div role="columnheader">Event Date</div>
      <div role="columnheader" />
    </div>
  );
};

interface EventRowProps {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
  eventPrefix: `membershipList.${number}.eventAttendedList.${number}`;
  /**
   * Is this the first event?
   *
   * - Membership Fee entry are shown as the first entry in the ticket table
   */
  isFirstEvent: boolean;
  showTicketEditor: boolean;
  onTicketEditorToggle: () => void;
  onRemove?: () => void;
}

export const EventRow: React.FC<EventRowProps> = ({
  className,
  membershipPrefix,
  eventPrefix,
  isFirstEvent,
  showTicketEditor,
  onTicketEditorToggle,
  onRemove,
}) => {
  const { control, formState } = useHookFormContext();
  const ticketListPrefix = `${eventPrefix}.ticketList` as const;
  const ticketListMethods = useFieldArray({
    control,
    name: ticketListPrefix,
  });
  const ticketCount =
    ticketListMethods.fields.length +
    // Show membership fee in the ticket section of first event
    (isFirstEvent ? 1 : 0);
  const errObj = R.pathOr(
    formState.errors,
    // @ts-expect-error unable to resolve type error
    R.stringToPath(ticketListPrefix),
    {}
  );
  const ticketListContainsError = !R.isEmpty(errObj);

  return (
    <>
      <div
        className={cn(className, 'col-span-full mx-3 grid grid-cols-subgrid')}
        role="row"
      >
        <FlatButton
          className={cn('pt-3')}
          // disabled={ticketCount === 0}
          onClick={onTicketEditorToggle}
        >
          <Badge
            placement="bottom-right"
            size="sm"
            variant="flat"
            content={
              <span className="flex items-center">
                {ticketCount}
                {ticketListContainsError && <Icon icon="warning" size={10} />}
              </span>
            }
            color={ticketListContainsError ? 'danger' : 'default'}
          >
            <motion.div
              className="justify-self-center text-foreground-400"
              role="cell"
              animate={{
                rotate: showTicketEditor ? 90 : 0,
              }}
            >
              <Icon icon="chevron-forward" />
            </motion.div>
          </Badge>
        </FlatButton>
        <div role="cell">
          <EventNameSelect
            membershipPrefix={membershipPrefix}
            eventPrefix={eventPrefix}
          />
        </div>
        <div role="cell">
          <EventDatePicker
            className="max-w-xs"
            membershipPrefix={membershipPrefix}
            eventPrefix={eventPrefix}
          />
        </div>
        <div className="flex gap-2 pt-3" role="cell">
          <FlatButton
            className="text-danger"
            icon="cross"
            tooltip="Remove Event"
            onClick={onRemove}
          />
        </div>
      </div>
      <div className="col-span-full">
        <AnimatePresence initial={false}>
          {showTicketEditor && (
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
                className={cn(
                  'rounded-lg border-medium border-divider',
                  'ml-10 p-1'
                )}
                ticketListConfig={{
                  controlNamePrefix: ticketListPrefix,
                  fieldMethods: ticketListMethods,
                }}
                {...(isFirstEvent && {
                  membershipConfig: {
                    controlNamePrefix: membershipPrefix,
                    canEdit: true,
                  },
                })}
                includeHiddenFields
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
