import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import {
  MailchimpStatusChip,
  OptOutChip,
  WarningChip,
} from '~/community/[communityId]/common/chip';
import * as GQL from '~/graphql/generated/graphql';
import { initialState, type FilterT } from '~/lib/reducers/mailchimp';
import { Truncate } from '~/view/base/truncate';

type FilterChangeFn = (input: FilterT) => Promise<void>;

interface Props {
  className?: string;
  openDrawer: () => void;
  filters: FilterT;
  isDisabled?: boolean;
  onFilterChange?: FilterChangeFn;
}

export const FilterChip: React.FC<Props> = ({
  className,
  openDrawer,
  filters,
  isDisabled,
  onFilterChange,
}) => {
  const { subscriberStatusList, optOut, warning } = filters;

  const removeStatus = React.useCallback(
    (status: GQL.MailchimpSubscriberStatus) => {
      const statusSet = new Set(filters.subscriberStatusList);
      statusSet.delete(status);
      onFilterChange?.({
        ...filters,
        subscriberStatusList: [...statusSet],
      });
    },
    [filters, onFilterChange]
  );

  return (
    <Truncate
      className={twMerge(
        'hidden items-center gap-2 sm:flex',
        'cursor-pointer',
        className
      )}
      onClick={openDrawer}
    >
      {!R.isDeepEqual(
        subscriberStatusList,
        initialState.filter.subscriberStatusList
      ) &&
        subscriberStatusList.map((status) => (
          <MailchimpStatusChip
            key={status}
            status={status}
            variant="bordered"
            isDisabled={isDisabled}
            onClose={() => removeStatus(status)}
          />
        ))}
      {optOut != null && (
        <OptOutChip
          optOut={optOut}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({ ...filters, optOut: initialState.filter.optOut })
          }
        />
      )}
      {warning != null && (
        <WarningChip
          warning={warning}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({
              ...filters,
              warning: initialState.filter.warning,
            })
          }
        />
      )}
    </Truncate>
  );
};
