'use client';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { PropertySearchBar } from '~/community/[communityId]/common/property-search-bar';
import { appPath } from '~/lib/app-path';
import { LastModified } from '~/view/last-modified';
import { MembershipDisplay } from './membership-display';
import * as membershipEditorModal from './membership-editor-modal';
import { MoreMenu } from './more-menu';
import { OccupantDisplay } from './occupant-display';
import * as occupantEditorModal from './occupant-editor-modal';
import { usePageContext } from './page-context';
import * as propertyDeleteModal from './property-delete-modal';
import { PropertyDisplay } from './property-display';
import * as propertyModifyModal from './property-modify-modal';
import * as registerEventModal from './register-event-modal';

interface Props {}

export const PageContent: React.FC<Props> = (props) => {
  const router = useRouter();
  const { property, community } = usePageContext();
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
      <div className="flex gap-2">
        <PropertyDisplay />
      </div>
      <Divider />
      <MembershipDisplay />
      <OccupantDisplay />
      <LastModified
        className="text-right"
        updatedAt={property.updatedAt}
        userFragment={property.updatedBy}
      />
      <propertyModifyModal.PropertyModifyModal />
      <membershipEditorModal.MembershipEditorModal />
      <occupantEditorModal.OccupantEditorModal />
      <propertyDeleteModal.PropertyDeleteModal />
      <registerEventModal.RegisterEventModal />
    </div>
  );
};
