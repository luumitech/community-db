import { cn } from '@heroui/react';
import React from 'react';
import {
  MemberModifyModal,
  useModalControl,
} from '~/community/[communityId]/third-party-integration/mailchimp/audience-list/member-modify-modal';
import { FlatButton } from '~/view/base/flat-button';
import type { AudienceMember } from '../../_type';

interface Props {
  className?: string;
  audienceListId: string;
  member: AudienceMember;
}

export const ModifyMemberButton: React.FC<Props> = ({
  className,
  audienceListId,
  member,
}) => {
  const modalControl = useModalControl();

  return (
    <div className={cn('flex items-center', className)}>
      <FlatButton
        className="text-primary"
        icon="mailchimp"
        isBlock
        tooltip="Modify Mailchimp Contact"
        onClick={() => modalControl.open({ audienceListId, member })}
      />
      <MemberModifyModal modalControl={modalControl} />
    </div>
  );
};
