import { Chip, Tooltip, cn, type SelectedItems } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import {
  subscriberStatusItems,
  type SubscriberStatusItem,
} from '~/lib/reducers/mailchimp';
import { Select, SelectItem } from '~/view/base/select';

/** Helper hook to manage the status filter state */
export function useStatusFilter() {
  const [statusFilter, setStatusFilter] = React.useState<
    GQL.MailchimpSubscriberStatus[] | 'all'
  >('all');

  return [statusFilter, setStatusFilter] as const;
}

interface StatusChipProps {
  status?: GQL.MailchimpSubscriberStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  if (!status) {
    return null;
  }
  const item = subscriberStatusItems.find(({ key }) => key === status);
  if (!item) {
    return null;
  }

  return (
    <Tooltip className="max-w-xs" content={item?.desc}>
      <Chip className="text-tiny capitalize" size="sm">
        {item?.label}
      </Chip>
    </Tooltip>
  );
};

interface StatusFilterProps {
  className?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ className }) => {
  const renderValue = React.useCallback(
    (items: SelectedItems<SubscriberStatusItem>) => {
      const itemsToShow = subscriberStatusItems
        .map((statusItem) => {
          const found = items.find((item) => item.key === statusItem.key);
          return found ? statusItem : null;
        })
        .filter((item): item is SubscriberStatusItem => item !== null);

      return (
        <div className="flex flex-wrap items-center gap-1">
          {itemsToShow.map((item) => (
            <StatusChip key={item.key} status={item.key} />
          ))}
        </div>
      );
    },
    []
  );

  return (
    <Select
      className={cn(className)}
      controlName="subscriberStatusList"
      items={subscriberStatusItems}
      label="Mailchimp Subscriber Status"
      placeholder="Unspecified"
      selectionMode="multiple"
      disallowEmptySelection={true}
      isClearable
      renderValue={renderValue}
      isMultiline
      description="Show only entries matching the selected status"
    >
      {(item) => (
        <SelectItem key={item.key} textValue={item.label}>
          <div className="flex flex-col">
            <span className="text-small">{item.label}</span>
            <span className="text-tiny text-default-400">{item.desc}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
