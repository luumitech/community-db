import clsx from 'clsx';
import React from 'react';
import { Select, SelectItem } from '~/view/base/select';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
} from '../year-select-items';
import { MembershipListFieldArray, membershipDefault } from './use-hook-form';

interface Props {
  className?: string;
  yearRange: [number, number];
  membershipMethods: MembershipListFieldArray;
  /** Currently selected year in Select */
  selectedYear: string;
  /** Handler when user selects a year */
  onChange: (year: string) => void;
}

export const YearSelect: React.FC<Props> = ({
  className,
  yearRange,
  membershipMethods,
  selectedYear,
  onChange,
}) => {
  const { fields, prepend } = membershipMethods;

  const yearItems = React.useMemo(() => {
    const membershipList = fields.map((entry) => ({
      ...entry,
      isMember: entry.eventAttendedList.length > 0,
    }));
    const items = yearSelectItems(yearRange, membershipList, selectedYear);
    const maxYear = items[0].value;

    return [
      // Add an option to add future years
      { label: `Add Year ${maxYear + 1}`, value: maxYear + 1, isMember: null },
      ...items,
    ];
  }, [yearRange, fields, selectedYear]);

  const handleSelectionChange = React.useCallback<
    React.ChangeEventHandler<HTMLSelectElement>
  >(
    (evt) => {
      const userSelectedYear = evt.target.value;
      const userSelectedYearInt = parseInt(userSelectedYear, 10);
      // Selecting first entry in selection list will append
      // a new item to the membershipList
      if (userSelectedYearInt === yearItems[0].value) {
        prepend(membershipDefault(userSelectedYearInt));
      }
      onChange(userSelectedYear);
    },
    [prepend, yearItems, onChange]
  );

  return (
    <Select
      classNames={{
        base: clsx(className, 'max-w-sm'),
        label: 'whitespace-nowrap self-center',
      }}
      controlName=""
      label="Membership Year"
      labelPlacement="outside-left"
      placeholder="Select a year to view in detail"
      disallowEmptySelection
      items={yearItems}
      selectedKeys={[selectedYear.toString()]}
      selectionMode="single"
      onChange={handleSelectionChange}
      renderValue={(items) => <SelectedYearItem items={items} />}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          <YearItemLabel item={item} />
        </SelectItem>
      )}
    </Select>
  );
};
