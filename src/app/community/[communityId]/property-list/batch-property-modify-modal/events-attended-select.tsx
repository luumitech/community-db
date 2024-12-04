import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { DatePicker } from '~/view/base/date-picker';
import { Select, SelectItem, SelectSection } from '~/view/base/select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EventsAttendedSelect: React.FC<Props> = ({ className }) => {
  const { selectEventSections } = useAppContext();
  const { formState } = useHookFormContext();

  return (
    <div className={clsx(className, 'flex gap-2')}>
      <Select
        className="max-w-sm"
        controlName="membership.eventAttended.eventName"
        label="Event Name"
        items={selectEventSections}
        placeholder="Select an event"
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
        className="max-w-sm"
        controlName="membership.eventAttended.eventDate"
        label="Event Date"
        granularity="day"
      />
    </div>
  );
};
