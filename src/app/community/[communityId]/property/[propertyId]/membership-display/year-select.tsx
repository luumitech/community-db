import { Select, SelectItem } from '@nextui-org/react';
import { useSet } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';

interface Props {
  className?: string;
  membershipList: GQL.PropertyId_MembershipDisplayFragment['membershipList'];
  selectedYear: number;
  onChange: (year: number) => void;
}

export const YearSelect: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  membershipList,
  selectedYear,
  onChange,
  children,
}) => {
  const year = useSet([selectedYear]);

  return (
    <div className={clsx(className, 'flex flex-grow items-center gap-2')}>
      <Select
        className="max-w-[90px]"
        aria-label="Membership Year"
        placeholder="Select a year"
        selectedKeys={year.values()}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const [firstKey] = keys;
          const yearSelected = parseInt(firstKey as string, 10);
          year.clear();
          year.add(yearSelected);
          onChange(yearSelected);
        }}
      >
        {(membershipList ?? []).map((entry) => (
          <SelectItem key={entry.year} textValue={entry.year.toString()}>
            {entry.year}
          </SelectItem>
        ))}
      </Select>
      {children}
    </div>
  );
};
