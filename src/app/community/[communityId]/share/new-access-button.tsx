import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { type AccessEntry } from './_type';
import { NewAccessModal, useModalControl } from './new-access-modal';

interface Props {
  className?: string;
  communityId: string;
  accessList: AccessEntry[];
}

export const NewAccessButton: React.FC<Props> = ({
  className,
  communityId,
  accessList,
}) => {
  const modalControl = useModalControl();

  return (
    <div className={className}>
      <Button
        color="primary"
        endContent={<Icon icon="person-add" />}
        onPress={() => modalControl.open({ communityId, accessList })}
      >
        Add user...
      </Button>
      <NewAccessModal modalControl={modalControl} />
    </div>
  );
};
