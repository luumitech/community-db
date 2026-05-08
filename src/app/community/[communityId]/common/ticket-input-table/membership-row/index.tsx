import { cn } from '@heroui/react';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import { type MembershipConfig } from '../ticket-context';
import { MembershipAddButton } from './membership-add-button';
import { MembershipEdit } from './membership-edit';

interface MembershipRowProps extends MembershipConfig {
  onRemove?: () => void;
}

export const MembershipRow: React.FC<MembershipRowProps> = ({
  onRemove,
  ...membershipConfig
}) => {
  const { existingMembership, controlNamePrefix } = membershipConfig;
  const { watch } = useFormContext();
  const isMember = watch(`${controlNamePrefix}.isMember`);

  // Should not allow membership editor function if user is already a member
  if (existingMembership?.isMember) {
    return null;
  }

  return (
    <div className={cn('col-span-full mx-3 grid grid-cols-subgrid')} role="row">
      <div role="cell" />
      {isMember ? (
        <MembershipEdit {...membershipConfig} onRemove={onRemove} />
      ) : (
        <div role="cell" className="col-span-5">
          <MembershipAddButton {...membershipConfig} />
        </div>
      )}
    </div>
  );
};
