import { cn } from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { AccessEntry } from '../_type';
import { ModifyAccessModal, useModalControl } from '../modify-access-modal';

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const ModifyAccessButton: React.FC<Props> = ({
  className,
  fragment,
}) => {
  const modalControl = useModalControl();

  return (
    <div className={cn(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip="Modify Role"
        onClick={() => modalControl.open({ access: fragment })}
      />
      <ModifyAccessModal modalControl={modalControl} />
    </div>
  );
};
