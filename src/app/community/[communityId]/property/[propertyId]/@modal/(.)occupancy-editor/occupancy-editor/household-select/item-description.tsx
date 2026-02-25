import { Chip, cn, type ChipProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { Truncate } from '~/view/base/truncate';
import { type OccupancyInfoEntry } from '../../use-hook-form';

interface Props extends ChipProps {
  className?: string;
  occupancyInfo: OccupancyInfoEntry;
  hasError?: boolean;
}

export const ItemDescription: React.FC<Props> = ({
  className,
  occupancyInfo,
  hasError,
  ...props
}) => {
  const nameList = occupancyInfo.occupantList
    .map(({ firstName, lastName }) => {
      const name = `${firstName ?? ''} ${lastName ?? ''}`;
      return name.trim();
    })
    .filter((name) => !R.isEmpty(name));

  if (nameList.length === 0) {
    return 'No contacts';
  }

  return (
    <Truncate
      className={twMerge('flex items-center gap-2', className)}
      data-testid="member-names"
      role="list"
    >
      {nameList.map((name, idx) => (
        <Chip
          key={idx}
          classNames={{
            base: cn(
              /**
               * Change the border so when the item is selected, the background
               * is still visible
               */
              !hasError && 'group-data-[hover=true]:border-default-400'
            ),
          }}
          size="sm"
          role="listitem"
          variant="bordered"
          {...(hasError && { color: 'danger' })}
          {...props}
        >
          {name}
        </Chip>
      ))}
    </Truncate>
  );
};
