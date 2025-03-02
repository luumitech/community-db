'use client';
import { Divider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PropertySearchBar } from '~/community/[communityId]/common/property-search-bar';
import { CommunityModifyModal } from '~/community/[communityId]/community-modify-modal';
import { appPath } from '~/lib/app-path';
import { LastModified } from '~/view/last-modified';
import { MembershipDisplay } from './membership-display';
import { MembershipEditorModal } from './membership-editor-modal';
import { MoreMenu } from './more-menu';
import { OccupantDisplay } from './occupant-display';
import { OccupantEditorModal } from './occupant-editor-modal';
import { usePageContext } from './page-context';
import { PropertyDeleteModal } from './property-delete-modal';
import { PropertyDisplay } from './property-display';
import { PropertyModifyModal } from './property-modify-modal';
import { RegisterEventModal } from './register-event-modal';
import { SendMailModal } from './send-mail-modal';

interface Props {}

export const PageContent: React.FC<Props> = (props) => {
  const router = useRouter();
  const {
    property,
    community,
    propertyModify,
    membershipEditor,
    occupantEditor,
    propertyDelete,
    registerEvent,
    communityModify,
    sendMail,
  } = usePageContext();
  const routerCalled = React.useRef(false);

  const onSearchChanged = React.useCallback(() => {
    if (!routerCalled.current) {
      const propertyListPath = appPath('propertyList', {
        path: { communityId: community.id },
      });
      routerCalled.current = true;
      router.push(propertyListPath);
    }
  }, [router, community.id]);

  return (
    <div className="flex flex-col gap-3">
      <MoreMenu />
      <PropertySearchBar onChange={onSearchChanged} />
      <PropertyDisplay />
      <Divider />
      <MembershipDisplay />
      <OccupantDisplay />
      <LastModified
        updatedAt={property.updatedAt}
        updatedBy={property.updatedBy}
      />
      <PropertyModifyModal modalControl={propertyModify} />
      <MembershipEditorModal modalControl={membershipEditor} />
      <OccupantEditorModal modalControl={occupantEditor} />
      <PropertyDeleteModal modalControl={propertyDelete} />
      <RegisterEventModal modalControl={registerEvent} />
      <CommunityModifyModal modalControl={communityModify} />
      <SendMailModal modalControl={sendMail} />
    </div>
  );
};
