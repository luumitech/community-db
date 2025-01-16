import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { usePageContext } from '../page-context';

interface Props {
  className?: string;
}

export const EditMembershipButton: React.FC<Props> = ({ className }) => {
  const { membershipEditor } = usePageContext();

  return (
    <div className={clsx(className)}>
      <FlatButton
        className="text-primary"
        icon="edit"
        tooltip="Edit Membership Detail"
        onClick={membershipEditor.disclosure.onOpen}
      />
    </div>
  );
};
