import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { AccessEntry } from '../_type';
import { ModifyAccessModal } from '../modify-access-modal';
import { useHookFormWithDisclosure } from '../modify-access-modal/use-hook-form';

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const ModifyAccessButton: React.FC<Props> = ({
  className,
  fragment,
}) => {
  const hookForm = useHookFormWithDisclosure(fragment);

  return (
    <div className={clsx(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip="Modify Role"
        {...hookForm.disclosure.getButtonProps()}
      />
      <ModifyAccessModal hookForm={hookForm} />
    </div>
  );
};
