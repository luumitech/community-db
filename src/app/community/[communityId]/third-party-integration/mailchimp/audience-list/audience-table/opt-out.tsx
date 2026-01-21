import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import type { AudienceMember } from '../_type';

interface Props {
  className?: string;
  item: AudienceMember;
}

export const OptOut: React.FC<Props> = ({ className, item }) => {
  const { occupant } = item;

  if (!occupant?.optOut) {
    return null;
  }

  return <Icon icon="checkmark" size={16} />;
};
