'use client';
import { Divider } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { LastModified } from '~/view/last-modified';
import type { CommunityEntry, PropertyEntry } from './_type';
import { MembershipDisplay } from './membership-display';
import * as membershipEditorModal from './membership-editor-modal';
import { ModalButton } from './modal-button';
import { MoreMenu } from './more-menu';
import { OccupantDisplay } from './occupant-display';
import * as occupantEditorModal from './occupant-editor-modal';
import * as propertyDeleteModal from './property-delete-modal';
import { PropertyDisplay } from './property-display';
import * as propertyModifyModal from './property-modify-modal';

interface Props {
  community: CommunityEntry;
  property: PropertyEntry;
}

export const PageContent: React.FC<Props> = ({ community, property }) => {
  const { canEdit, communityUi } = useAppContext();
  const { yearSelected } = communityUi;
  const occupantEditor =
    occupantEditorModal.useHookFormWithDisclosure(property);
  const propertyModify =
    propertyModifyModal.useHookFormWithDisclosure(property);
  const membershipEditor = membershipEditorModal.useHookFormWithDisclosure(
    property,
    yearSelected
  );
  const propertyDelete =
    propertyDeleteModal.useHookFormWithDisclosure(property);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <PropertyDisplay fragment={property} />
        <MoreMenu
          community={community}
          property={property}
          propertyModify={propertyModify}
          propertyDelete={propertyDelete}
          membershipEditor={membershipEditor}
          occupantEditor={occupantEditor}
        />
      </div>
      <Divider />
      <MembershipDisplay fragment={property} />
      {canEdit && (
        <ModalButton {...membershipEditor.disclosure.getButtonProps()}>
          Edit Membership Info
        </ModalButton>
      )}
      <OccupantDisplay fragment={property} />
      {canEdit && (
        <ModalButton {...occupantEditor.disclosure.getButtonProps()}>
          Edit Member Details
        </ModalButton>
      )}
      <LastModified
        className="text-right"
        updatedAt={property.updatedAt}
        userFragment={property.updatedBy}
      />
      <propertyModifyModal.PropertyModifyModal
        communityId={community.id}
        hookForm={propertyModify}
      />
      <membershipEditorModal.MembershipEditorModal
        hookForm={membershipEditor}
      />
      <occupantEditorModal.OccupantEditorModal hookForm={occupantEditor} />
      <propertyDeleteModal.PropertyDeleteModal
        communityId={community.id}
        hookForm={propertyDelete}
      />
    </div>
  );
};
