import { Chip, ChipProps, Tooltip } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { subscriberStatusItems } from '../filter-drawer/status-select';

interface Props extends ChipProps {
  status: GQL.MailchimpSubscriberStatus;
}

export const StatusChip: React.FC<Props> = ({ status, ...props }) => {
  const found = subscriberStatusItems.find((item) => item.key === status);
  if (!found) {
    return null;
  }

  return (
    <Tooltip className="max-w-xs" content={found.desc}>
      <Chip className="text-tiny capitalize" size="sm" {...props}>
        <div className="flex items-center gap-2">{found.label}</div>
      </Chip>
    </Tooltip>
  );
};
