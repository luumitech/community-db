import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { yearSelectItems } from '../year-select-items';
import { MembershipListFieldArray, membershipDefault } from './use-hook-form';

interface Props {
  className?: string;
  membershipMethods: MembershipListFieldArray;
  /**
   * currently selected year in Select
   */
  selectedYear: string;
  /**
   * handler when user selects a year
   */
  onChange: (year: string) => void;
}

export const YearSelect: React.FC<Props> = ({
  className,
  membershipMethods,
  selectedYear,
  onChange,
}) => {
  const { fields, prepend } = membershipMethods;

  const yearItems = React.useMemo(() => {
    const items = yearSelectItems(fields, selectedYear);
    const maxYear = items[0].value;

    return [
      // Add an option to add future years
      { label: `Add Year ${maxYear + 1}`, value: maxYear + 1 },
      ...items,
    ];
  }, [fields, selectedYear]);

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
      className={clsx(className, 'max-w-sm')}
      label="Membership Year"
      labelPlacement="outside-left"
      placeholder="Select a year to view in detail"
      items={yearItems}
      selectedKeys={[selectedYear.toString()]}
      selectionMode="single"
      onChange={handleSelectionChange}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
