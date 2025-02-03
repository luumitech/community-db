import { cn } from '@heroui/react';
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
    <div className={cn(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip="Modify Role"
        onClick={hookForm.disclosure.onOpen}
      />
      <ModifyAccessModal hookForm={hookForm} />
    </div>
  );
};
