import { Chip, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import {
  initialState,
  subscriberStatusItems,
  type FilterT,
} from '~/lib/reducers/mailchimp';
import { Icon } from '~/view/base/icon';
import { OptOutChip } from './opt-out-chip';
import { WarningChip } from './warning-chip';

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

  const onChange = React.useCallback<FilterChangeFn>(
    async (_filters) => {
      onFilterChange?.(_filters);
    },
    [onFilterChange]
  );

  return (
    <div
      className={cn(className, 'hidden cursor-pointer gap-2 sm:flex')}
      onClick={openDrawer}
    >
      {!R.isDeepEqual(
        subscriberStatusList,
        initialState.subscriberStatusList
      ) && (
        <Chip
          variant="bordered"
          color="success"
          isDisabled={isDisabled}
          onClose={() =>
            onChange({
              ...filters,
              subscriberStatusList: initialState.subscriberStatusList,
            })
          }
        >
          <div className="flex items-center gap-2">
            {subscriberStatusList
              .map((key) => {
                const entry = subscriberStatusItems.find(
                  (item) => item.key === key
                );
                return entry!.label;
              })
              .join(', ')}
          </div>
        </Chip>
      )}
      {optOut != null && (
        <OptOutChip
          optOut={optOut}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, optOut: initialState.optOut })}
        />
      )}
      {warning != null && (
        <WarningChip
          warning={warning}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() =>
            onChange({ ...filters, warning: initialState.warning })
          }
        />
      )}
    </div>
  );
};
