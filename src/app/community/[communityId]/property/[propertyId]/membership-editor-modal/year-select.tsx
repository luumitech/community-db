import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
} from '../year-select-items';
import { membershipDefault, useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  yearRange: [number, number];
  membershipList: GQL.PropertyId_MembershipEditorFragment['membershipList'];
  /** Currently selected year in Select */
  selectedYear: string;
  /** Handler when user selects a year */
  onChange: (year: string) => void;
  /** When user chooses to add a year to selection list */
  onAddYear: (entry: ReturnType<typeof membershipDefault>) => void;
}

export const YearSelect: React.FC<Props> = ({
  className,
  yearRange,
  membershipList,
  selectedYear,
  onChange,
  onAddYear,
}) => {
  const { formState } = useHookFormContext();
  const { errors } = formState;

  const yearItems = React.useMemo(() => {
    const membershipListWithMember = membershipList.map((entry) => ({
      ...entry,
      isMember: entry.eventAttendedList.length > 0,
    }));
    const items = yearSelectItems(
      yearRange,
      membershipListWithMember,
      selectedYear
    );
    const maxYear = items[0].value;

    return [
      // Add an option to add future years
      { label: `Add Year ${maxYear + 1}`, value: maxYear + 1, isMember: null },
      ...items,
    ];
  }, [yearRange, membershipList, selectedYear]);

  const handleSelectionChange = React.useCallback<
    React.ChangeEventHandler<HTMLSelectElement>
  >(
    (evt) => {
      const userSelectedYear = evt.target.value;
      const userSelectedYearInt = parseInt(userSelectedYear, 10);
      // Selecting first entry in selection list will append
      // a new item to the membershipList
      if (userSelectedYearInt === yearItems[0].value) {
        onAddYear(membershipDefault(userSelectedYearInt));
      } else {
        onChange(userSelectedYear);
      }
    },
    [onAddYear, yearItems, onChange]
  );

  const errorMsg = React.useMemo(() => {
    const membershipError = errors?.membershipList ?? [];
    const [minYear, maxYear] = yearRange;
    const yearNum = R.range(minYear, maxYear + 1).reverse();
    const yearWithErrors = membershipError
      .map?.((_, idx) => yearNum[idx])
      ?.filter(
        (year): year is number =>
          year != null && year.toString() !== selectedYear
      );
    if (yearWithErrors?.length) {
      return `Please fix error(s) in ${yearWithErrors.join(', ')}`;
    }
  }, [errors, yearRange, selectedYear]);

  return (
    <Select
      classNames={{
        base: clsx(className, 'max-w-sm'),
        label: 'whitespace-nowrap self-center',
      }}
      label="Membership Year"
      labelPlacement="outside-left"
      placeholder="Select a year to view in detail"
      disallowEmptySelection
      items={yearItems}
      selectedKeys={[selectedYear.toString()]}
      selectionMode="single"
      onChange={handleSelectionChange}
      renderValue={(items) => <SelectedYearItem items={items} />}
      errorMessage={errorMsg}
      isInvalid={!!errorMsg}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          <YearItemLabel item={item} />
        </SelectItem>
      )}
    </Select>
  );
};
