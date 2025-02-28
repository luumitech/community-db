import { Chip, cn } from '@heroui/react';
import React from 'react';
import { Select, SelectItem } from '~/view/base/select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ToSelect: React.FC<Props> = ({ className }) => {
  const { getValues } = useHookFormContext();
  const toItems = getValues('hidden.toItems');

  return (
    <Select
      className={cn(className)}
      controlName="toEmail"
      fullWidth
      isMultiline={true}
      label="To"
      variant="bordered"
      items={toItems}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip key={item.key} size="sm">
                {item.data?.fullName}
              </Chip>
            ))}
          </div>
        );
      }}
      selectionMode="multiple"
    >
      {(user) => (
        <SelectItem key={user.email} textValue={user.fullName}>
          <div className="flex flex-col">
            <span className="text-small">{user.fullName}</span>
            <span className="text-tiny text-default-400">{user.email}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
