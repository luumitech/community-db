import clsx from 'clsx';
import React from 'react';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { NewAccessModal, useHookFormWithDisclosure } from './new-access-modal';

interface Props {
  className?: string;
  communityId: string;
}

export const NewAccessButton: React.FC<Props> = ({
  className,
  communityId,
}) => {
  const hookForm = useHookFormWithDisclosure(communityId);

  return (
    <div className={clsx(className)}>
      <Button
        color="primary"
        endContent={<Icon icon="person-add" />}
        {...hookForm.disclosure.getButtonProps()}
      >
        Add user...
      </Button>
      <NewAccessModal hookForm={hookForm} />
    </div>
  );
};
