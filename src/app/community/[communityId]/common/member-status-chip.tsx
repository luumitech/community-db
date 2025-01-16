import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  isMember?: boolean;
  /** Hide 'member' | 'non-member' text */
  hideText?: boolean;
  /** Hide thumb-up | thumb-down icon */
  hideIcon?: boolean;
}

export const MemberStatusChip: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  isMember,
  hideText,
  hideIcon,
  children,
}) => {
  return (
    <Chip
      className={className}
      variant="bordered"
      radius="md"
      color={isMember ? 'success' : 'default'}
    >
      <div className="flex items-center gap-2">
        {children}
        {!hideText && <span>{isMember ? 'member' : 'non-member'}</span>}
        {!hideIcon && (
          <Icon icon={isMember ? 'thumb-up' : 'thumb-down'} size={16} />
        )}
      </div>
    </Chip>
  );
};
