import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
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
      <Button {...hookForm.disclosure.getButtonProps()}>Add user...</Button>
      <NewAccessModal hookForm={hookForm} />
    </div>
  );
};
