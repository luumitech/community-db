import React from 'react';
import { Button, type ButtonProps } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { NewAccessModal, useModalControl } from './new-access-modal';

interface Props extends ButtonProps {
  className?: string;
  communityId: string;
  accessEmailList: string[];
}

export const AddUserButton: React.FC<Props> = ({
  className,
  communityId,
  accessEmailList,
  ...props
}) => {
  const modalControl = useModalControl();

  return (
    <div className={className}>
      <Button
        className="ml-3"
        color="primary"
        variant="bordered"
        endContent={<Icon icon="person-add" />}
        onPress={() => modalControl.open({ communityId, accessEmailList })}
        {...props}
      >
        Add user...
      </Button>
      <NewAccessModal modalControl={modalControl} />
    </div>
  );
};
