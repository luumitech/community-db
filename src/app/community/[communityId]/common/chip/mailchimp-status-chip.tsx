import { Chip, ChipProps } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Tooltip } from '~/view/base/tooltip';
import { subscriberStatusItems } from '../../third-party-integration/mailchimp/audience-list/status-select';

interface Props extends ChipProps {
  status: GQL.MailchimpSubscriberStatus;
}

export const MailchimpStatusChip: React.FC<Props> = ({ status, ...props }) => {
  const found = subscriberStatusItems.find((item) => item.key === status);
  if (!found) {
    return null;
  }

  return (
    <Tooltip isFixed content={found.desc}>
      <Chip className="text-tiny capitalize" size="sm" {...props}>
        <div className="flex items-center gap-2">{found.label}</div>
      </Chip>
    </Tooltip>
  );
};
