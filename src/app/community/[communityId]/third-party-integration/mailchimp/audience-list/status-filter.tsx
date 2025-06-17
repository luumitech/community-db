import {
  Chip,
  ScrollShadow,
  Select,
  SelectItem,
  cn,
  type SelectedItems,
} from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';

interface StatusItem {
  key: GQL.MailchimpSubscriberStatus;
  label: string;
  desc: string;
}

const statusItems: StatusItem[] = [
  {
    key: GQL.MailchimpSubscriberStatus.Subscribed,
    label: 'Subscribed',
    desc: 'These are individuals who have opted in to receive your email marketing campaigns',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Unsubscribed,
    label: 'Unsubscribed',
    desc: 'These are individuals who previously opted in but have since opted out',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Cleaned,
    label: 'Cleaned',
    desc: 'These are non-deliverable email addresses, either due to hard bounces (permanent failure) or repeated soft bounces (temporary failure)',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Pending,
    label: 'Pending',
    desc: "These are email addresses that are waiting for confirmation or haven't been fully verified",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Transactional,
    label: 'Transactional',
    desc: "These are individuals who have interacted with your online store or provided contact information but haven't opted in to receive email marketing campaigns",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Archive,
    label: 'Archive',
    desc: 'These are contacts that have been moved to a separate archived contacts table, effectively removing them from the main list',
  },
];

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

  return (
    <Chip className="text-tiny capitalize" size="sm">
      {status}
    </Chip>
  );
};

interface StatusFilterProps {
  className?: string;
  selected: GQL.MailchimpSubscriberStatus[] | 'all';
  onSelect?: (status: GQL.MailchimpSubscriberStatus[]) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  className,
  selected,
  onSelect,
}) => {
  const renderValue = React.useCallback((items: SelectedItems<StatusItem>) => {
    const itemsToShow = statusItems
      .map((statusItem) => {
        const found = items.find((item) => item.key === statusItem.key);
        return found ? statusItem : null;
      })
      .filter((item): item is StatusItem => item !== null);

    return (
      <ScrollShadow
        className="flex gap-1"
        orientation="horizontal"
        hideScrollBar
      >
        {itemsToShow.map((item) => (
          <StatusChip key={item.key} status={item.key} />
        ))}
      </ScrollShadow>
    );
  }, []);

  return (
    <Select
      className={cn(className, 'max-w-xs')}
      items={statusItems}
      label="Mailchimp Subscriber Status"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={(keys) => {
        const selectedKeys = Array.from(
          keys
        ) as GQL.MailchimpSubscriberStatus[];
        onSelect?.(selectedKeys);
      }}
      renderValue={renderValue}
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
