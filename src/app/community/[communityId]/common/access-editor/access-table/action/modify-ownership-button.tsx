import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { CommunityEntry } from '../../_type';
import {
  ModifyOwnershipModal,
  useModalControl,
} from '../../modify-ownership-modal';

interface Props {
  className?: string;
  community: CommunityEntry;
}

export const ModifyOwnershipButton: React.FC<Props> = ({
  className,
  community,
}) => {
  const modalControl = useModalControl();

  return (
    <div className={className}>
      <FlatButton
        className="text-primary"
        icon="person-edit"
        tooltip="Modify Ownership"
        tooltipProps={{ isFixed: true }}
        onClick={() => modalControl.open({ community })}
      />
      <ModifyOwnershipModal modalControl={modalControl} />
    </div>
  );
};
