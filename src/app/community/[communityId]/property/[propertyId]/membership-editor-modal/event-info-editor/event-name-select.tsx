import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  Select,
  SelectItem,
  SelectProps,
  SelectSection,
} from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
  eventIdx: number;
}

export const EventNameSelect: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
}) => {
  const { selectEventSections } = useAppContext();
  const { clearErrors } = useHookFormContext();

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        /**
         * This is needed because errors like duplicate event names are not
         * cleared automatically after selection is changed
         */
        clearErrors(`membershipList.${yearIdx}.eventAttendedList`);
      },
      [clearErrors, yearIdx]
    );

  return (
    <Select
      className={clsx(className, 'min-w-32 max-w-xs')}
      controlName={`membershipList.${yearIdx}.eventAttendedList.${eventIdx}.eventName`}
      aria-label="Event Name"
      items={selectEventSections}
      variant="underlined"
      // placeholder="Select an event"
      onSelectionChange={onSelectionChange}
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
  );
};
