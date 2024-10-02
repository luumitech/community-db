import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  membership?: Pick<GQL.Membership, 'isMember'>;
}

export const MemberStatusChip: React.FC<Props> = ({
  className,
  membership,
}) => {
  const { isMember } = membership ?? {};

  return (
    <div className={clsx(className, 'flex gap-2')}>
      <Chip
        variant="bordered"
        radius="md"
        color={isMember ? 'success' : 'default'}
      >
        <div className="flex items-center gap-2">
          {isMember ? 'member' : 'non-member'}
          <Icon icon={isMember ? 'thumb-up' : 'thumb-down'} size={16} />
        </div>
      </Chip>
    </div>
  );
};
