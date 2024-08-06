import { Chip, Select, SelectItem } from '@nextui-org/react';
import { useSet } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { yearSelectItems, type YearItem } from '../year-select-items';

interface Props {
  className?: string;
  membershipList: GQL.PropertyId_MembershipDisplayFragment['membershipList'];
  selectedYear: string;
  onChange: (year: string) => void;
}

export const YearSelect: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  membershipList,
  selectedYear,
  onChange,
  children,
}) => {
  const year = useSet([selectedYear]);
  const yearItems = React.useMemo(() => {
    return yearSelectItems(membershipList, selectedYear);
  }, [membershipList, selectedYear]);

  return (
    <div className={clsx(className, 'flex flex-grow items-center gap-2')}>
      {children}
      <Select
        classNames={{
          base: 'max-w-[150px]',
        }}
        aria-label="Membership Year"
        placeholder="Select a year"
        items={yearItems}
        selectedKeys={year.values()}
        selectionMode="single"
        disallowEmptySelection
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <YearItemLabel key={item.key} item={item.data!} />
              ))}
            </div>
          );
        }}
        onSelectionChange={(keys) => {
          const [firstKey] = keys;
          const yearSelected = firstKey as string;
          year.clear();
          year.add(yearSelected);
          onChange(yearSelected);
        }}
      >
        {(item) => (
          <SelectItem key={item.value} textValue={item.label}>
            <YearItemLabel item={item} />
          </SelectItem>
        )}
      </Select>
    </div>
  );
};

interface ItemLabelProps {
  item: YearItem;
}

const YearItemLabel: React.FC<ItemLabelProps> = ({ item }) => {
  return (
    <div className="flex gap-2 items-center">
      {item.label}
      <Chip
        variant="flat"
        radius="md"
        size="sm"
        color={item.isMember ? 'success' : 'secondary'}
      >
        <Icon icon={item.isMember ? 'thumb-up' : 'thumb-down'} size={14} />
      </Chip>
    </div>
  );
};
