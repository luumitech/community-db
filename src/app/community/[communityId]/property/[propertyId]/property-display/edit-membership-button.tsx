import { cn } from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { usePageContext } from '../page-context';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const { membershipEditor } = usePageContext();

  return (
    <div className={cn(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip="Edit Membership Detail"
        onClick={() => membershipEditor.open({})}
      />
    </div>
  );
};
