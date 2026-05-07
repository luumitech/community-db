import { Button, cn } from '@heroui/react';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import { Icon } from '~/view/base/icon';
import { type MembershipConfig } from '../ticket-context';

interface Props extends MembershipConfig {
  className?: string;
}

export const MembershipAddButton: React.FC<Props> = ({
  className,
  ...membershipConfig
}) => {
  const { setValue } = useFormContext();
  const { controlNamePrefix } = membershipConfig;

  const onAddMembership = React.useCallback(() => {
    setValue(`${controlNamePrefix}.isMember`, true);
  }, [controlNamePrefix, setValue]);

  return (
    <Button
      className={cn(className)}
      color="primary"
      variant="bordered"
      radius="sm"
      size="sm"
      startContent={<Icon icon="add" />}
      onPress={onAddMembership}
    >
      Add Membership Fee
    </Button>
  );
};
