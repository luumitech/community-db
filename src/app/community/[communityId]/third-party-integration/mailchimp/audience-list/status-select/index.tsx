import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { MailchimpStatusChip } from '~/community/[communityId]/common/chip';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem, type SelectProps } from '~/view/base/select';

export const subscriberStatusItems: SelectItem[] = [
  {
    key: GQL.MailchimpSubscriberStatus.Subscribed,
    textValue: 'Subscribed',
    description:
      'These are individuals who have opted in to receive your email marketing campaigns',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Unsubscribed,
    textValue: 'Unsubscribed',
    description:
      'These are individuals who previously opted in but have since opted out',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Cleaned,
    textValue: 'Cleaned',
    description:
      'These are non-deliverable email addresses, either due to hard bounces (permanent failure) or repeated soft bounces (temporary failure)',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Pending,
    textValue: 'Pending',
    description:
      "These are email addresses that are waiting for confirmation or haven't been fully verified",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Transactional,
    textValue: 'Transactional',
    description:
      "These are individuals who have interacted with your online store or provided contact information but haven't opted in to receive email marketing campaigns",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Archive,
    textValue: 'Archive',
    description:
      'These are contacts that have been moved to a separate archived contacts table, effectively removing them from the main list',
  },
].map((item) => ({
  ...item,
  props: {
    classNames: {
      // Reverse the default 'truncate' for description
      description: cn('overflow-visible text-clip whitespace-normal'),
    },
  },
}));

type CustomProps = Omit<SelectProps, 'items'>;

interface Props extends CustomProps {
  className?: string;
  /** List of items to exclude from the selection list */
  excludeItems?: GQL.MailchimpSubscriberStatus[];
}

export const StatusSelect: React.FC<Props> = ({
  className,
  excludeItems,
  ...props
}) => {
  const renderValue = React.useCallback((items: SelectItem[]) => {
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
  }, []);

  const items = React.useMemo(() => {
    return R.differenceWith(
      subscriberStatusItems,
      excludeItems ?? [],
      (a, b) => a.key === b
    );
  }, [excludeItems]);

  return (
    <Select
      className={cn(className)}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  );
};
