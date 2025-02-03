import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { getCurrentDateAsISOString } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from '../use-hook-form';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
  yearIdx: number;
}

export const EventInfoEditor: React.FC<Props> = ({ className, yearIdx }) => {
  const { communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;
  const { control, formState } = useHookFormContext();
  const { errors } = formState;
  const eventAttendedListMethods = useFieldArray({
    control,
    name: `membershipList.${yearIdx}.eventAttendedList`,
  });
  const { fields, append } = eventAttendedListMethods;
  const eventAttendedListError =
    errors.membershipList?.[yearIdx]?.eventAttendedList?.message;

  const topContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-foreground-500 font-semibold text-sm">
          Attended Events
        </span>
        <Button
          color="primary"
          variant="bordered"
          size="sm"
          endContent={<Icon icon="add" />}
          onPress={() =>
            append({
              eventName: lastEventSelected ?? '',
              eventDate: getCurrentDateAsISOString(),
              ticketList: [],
            })
          }
        >
          Add Event
        </Button>
      </div>
    );
  }, [append, lastEventSelected]);

  const bottomContent = React.useMemo(() => {
    return <div className="text-sm text-danger">{eventAttendedListError}</div>;
  }, [eventAttendedListError]);

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      {topContent}
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div
          className={cn('grid grid-cols-[40px_repeat(2,1fr)_80px]', 'gap-2')}
        >
          <EventRowHeader />
          {fields.length === 0 && (
            <div
              className={cn(
                'col-span-full h-8',
                'justify-self-center content-center'
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
        </div>
      </ScrollShadow>
      {bottomContent}
    </div>
  );
};
