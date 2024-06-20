import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { type AccessEntry } from './_type';
import { NewAccessModal, useHookFormWithDisclosure } from './new-access-modal';

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
  const hookForm = useHookFormWithDisclosure(communityId, accessList);

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
