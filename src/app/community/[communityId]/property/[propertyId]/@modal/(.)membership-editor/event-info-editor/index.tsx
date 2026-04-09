import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useHookFormContext } from '../use-hook-form';
import { EventAddButton } from './event-add-button';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventInfoEditor: React.FC<Props> = ({ className, yearIdx }) => {
  const { control, formState, watch } = useHookFormContext();
  const { errors } = formState;
  const eventAttendedListMethods = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList`,
  });
  const eventAttendedList = watch(
    `membershipList.${yearIdx}.eventAttendedList`
  );

  const excludeEvents = React.useMemo(() => {
    if (eventAttendedList.length === 0) {
      return undefined;
    }
    return eventAttendedList.map(({ eventName }) => eventName);
  }, [eventAttendedList]);

  const { fields, append } = eventAttendedListMethods;
  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;

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
              <div className="text-sm text-foreground-500">
                No data to display
              </div>
            </div>
          )}
          {fields.map((field, eventIdx) => (
            <EventRow
              key={field.id}
              eventAttendedListMethods={eventAttendedListMethods}
              yearIdx={yearIdx}
              eventIdx={eventIdx}
            />
          ))}
          <div className="col-span-full grid grid-cols-subgrid">
            <div />
            <EventAddButton
              className="justify-self-start"
              excludeEvents={excludeEvents}
              onAppend={append}
            />
          </div>
        </div>
      </ScrollShadow>
      {bottomContent}
    </div>
  );
};
