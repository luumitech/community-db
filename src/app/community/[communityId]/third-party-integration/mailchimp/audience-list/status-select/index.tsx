import { cn, type SelectedItems } from '@heroui/react';
import React from 'react';
import { MailchimpStatusChip } from '~/community/[communityId]/common/chip';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem, type SelectProps } from '~/view/base/select';

/**
 * Status items and corresponding labels for GQL.MailchimpSubscriberStatus
 *
 * - Used for SelectItem component
 */
export interface SubscriberStatusItem {
  key: GQL.MailchimpSubscriberStatus;
  label: string;
  desc: string;
}

export const subscriberStatusItems: SubscriberStatusItem[] = [
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

type CustomProps = Omit<SelectProps<SubscriberStatusItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const StatusSelect: React.FC<Props> = ({ className, ...props }) => {
  const renderValue = React.useCallback(
    (items: SelectedItems<SubscriberStatusItem>) => {
      return (
        <div className="flex flex-wrap items-center gap-1">
          {items.map((item) => (
            <MailchimpStatusChip
              key={item.key}
              status={item.key as GQL.MailchimpSubscriberStatus}
            />
          ))}
        </div>
      );
    },
    []
  );

  return (
    <Select
      className={cn(className)}
      items={subscriberStatusItems}
      renderValue={renderValue}
      {...props}
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
