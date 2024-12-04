'use client';
import { Divider } from '@nextui-org/react';
import React from 'react';
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

interface Props {}

export const PageContent: React.FC<Props> = (props) => {
  const { property } = usePageContext();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <PropertyDisplay />
        <MoreMenu />
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
    </div>
  );
};
