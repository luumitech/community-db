import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useHookFormContext } from '../use-hook-form';
import { EventAddButton } from './event-add-button';
import { EventRow, EventRowHeader } from './event-row';
import { useTicketAccordion } from './use-ticket-accordion';

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const EventInfoEditor: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  const { control, formState, setValue } = useHookFormContext();
  const { errors } = formState;
  const eventAttendedListMethods = useFieldArray({
    control,
    name: `${membershipPrefix}.eventAttendedList`,
  });
  const recentlyInsertedFieldIdx = React.useRef<number>(null);
  const { fields, append, remove } = eventAttendedListMethods;
  const addExcludeEvents = React.useMemo(() => {
    if (fields.length === 0) {
      return undefined;
    }
    return fields.map(({ eventName }) => eventName);
  }, [fields]);

  const eventAttendedListErrObj = R.pathOr(
    errors,
    // @ts-expect-error unable to resolve type error
    R.stringToPath(`${membershipPrefix}.eventAttendedList`),
    {}
  );
  const eventAttendedListError = eventAttendedListErrObj?.message;

  // Open the first section by default
  const { isExpanded, toggle } = useTicketAccordion(fields[0]?.id);

  React.useEffect(() => {
    /** When adding a new event, automatically expand the ticket section */
    if (recentlyInsertedFieldIdx.current != null) {
      const fieldIdToToggle = fields[recentlyInsertedFieldIdx.current].id;
      recentlyInsertedFieldIdx.current = null;
      toggle(fieldIdToToggle);
    }
  }, [fields, toggle]);

  const bottomContent = React.useMemo(() => {
    return <div className="text-sm text-danger">{eventAttendedListError}</div>;
  }, [eventAttendedListError]);

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div
          className={cn('grid grid-cols-[40px_repeat(2,1fr)_80px]', 'gap-2')}
        >
          <EventRowHeader />
          {fields.length === 0 && (
            <div
              className={cn(
                'col-span-full h-8',
                'content-center justify-self-center'
              )}
            >
              <div className="text-sm text-foreground/60">
                No data to display
              </div>
            </div>
          )}
          {fields.map((field, eventIdx) => (
            <EventRow
              key={field.id}
              membershipPrefix={membershipPrefix}
              eventPrefix={`${membershipPrefix}.eventAttendedList.${eventIdx}`}
              showTicketEditor={isExpanded(field.id)}
              onTicketEditorToggle={() => toggle(field.id)}
              onRemove={() => {
                remove(eventIdx);
                if (fields.length === 1) {
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
          ))}
          <div className="col-span-full grid grid-cols-subgrid">
            <div />
            <EventAddButton
              className="justify-self-start"
              excludeEvents={addExcludeEvents}
              onAppend={(newItem) => {
                recentlyInsertedFieldIdx.current = fields.length;
                append(newItem);
              }}
            />
          </div>
        </div>
      </ScrollShadow>
      {bottomContent}
    </div>
  );
};
