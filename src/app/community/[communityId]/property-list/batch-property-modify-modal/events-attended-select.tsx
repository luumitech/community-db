import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { DatePicker } from '~/view/base/date-picker';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EventsAttendedSelect: React.FC<Props> = ({ className }) => {
  const { selectEventSections } = useAppContext();
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <div className={clsx(className, 'flex gap-2')}>
      <Select
        className={'max-w-sm'}
        label="Event Name"
        items={selectEventSections}
        placeholder="Select an event"
        errorMessage={errors.membership?.eventAttended?.eventName?.message}
        isInvalid={!!errors.membership?.eventAttended?.eventName?.message}
        isRequired
        {...register(`membership.eventAttended.eventName`)}
      >
        {(section) => (
          <SelectSection
            key={section.title}
            title={section.title}
            items={section.items}
            showDivider={section.showDivider}
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </SelectSection>
        )}
      </Select>
      <DatePicker
        className={'max-w-sm'}
        label="Event Date"
        granularity="day"
        name={`membership.eventAttended.eventDate`}
        isRequired
        errorMessage={errors.membership?.eventAttended?.eventDate?.message}
        isInvalid={!!errors.membership?.eventAttended?.eventDate?.message}
      />
    </div>
  );
};
