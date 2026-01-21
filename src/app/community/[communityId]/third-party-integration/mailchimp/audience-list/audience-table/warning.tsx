import { Tooltip, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import type { AudienceMember } from '../_type';

interface Props {
  className?: string;
  item: AudienceMember;
}

export const Warning: React.FC<Props> = ({ className, item }) => {
  const { warning } = item;

  if (!warning) {
    return null;
  }

  return (
    <Tooltip
      content={<div className="max-w-48 text-tiny text-wrap">{warning}</div>}
    >
      <Icon className="text-warning" icon="warning" size={16} />
    </Tooltip>
  );
};
