import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  isMember?: boolean;
}

export const MemberStatusChip: React.FC<Props> = ({ className, isMember }) => {
  return (
    <Chip
      className={className}
      variant="bordered"
      radius="md"
      color={isMember ? 'success' : 'default'}
    >
      <div className="flex items-center gap-2">
        {isMember ? 'member' : 'non-member'}
        <Icon icon={isMember ? 'thumb-up' : 'thumb-down'} size={16} />
      </div>
    </Chip>
  );
};
