import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import * as communityModifyModal from '../../community-modify-modal';
import * as batchPropertyModifyModal from '../batch-property-modify-modal';
import * as communityDeleteModal from '../community-delete-modal';
import * as propertyCreateModal from '../property-create-modal';
import { useMenuItem } from './use-menu-item';

interface Props {
  community: batchPropertyModifyModal.BatchPropertyModifyFragmentType &
    communityDeleteModal.DeleteFragmentType &
    communityModifyModal.ModifyFragmentType &
    propertyCreateModal.CreateFragmentType;
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const { canEdit, isAdmin } = useAppContext();

  const communityModify =
    communityModifyModal.useHookFormWithDisclosure(community);
  const batchPropertyModify =
    batchPropertyModifyModal.useHookFormWithDisclosure(community);
  const propertyCreate =
    propertyCreateModal.useHookFormWithDisclosure(community);
  const communityDelete =
    communityDeleteModal.useHookFormWithDisclosure(community);

  const menuItems = useMenuItem({
    communityId: communityModify.community.id,
    communityModifyDisclosure: communityModify.disclosure,
    batchPropertyModifyDisclosure: batchPropertyModify.disclosure,
    communityDeleteDisclosure: communityDelete.disclosure,
    propertyCreateDisclosure: propertyCreate.disclosure,
  });

  return (
    <>
      <HeaderMenu
        menuItems={menuItems}
        menuKeys={[
          'communityDashboard',
          'communityShare',
          'exportEmail',
          'communityExport',
          'divider',
          ...insertIf(canEdit, 'communityModify'),
          ...insertIf(canEdit, 'batchPropertyyModify'),
          'divider',
          ...insertIf(isAdmin, 'communityImport'),
          ...insertIf(isAdmin, 'propertyCreate'),
          ...insertIf(isAdmin, 'communityDelete'),
        ]}
        shortcutKeys={[
          'communityDashboard',
          'communityModify',
          'communityShare',
        ]}
      />
      <communityModifyModal.CommunityModifyModal hookForm={communityModify} />
      <batchPropertyModifyModal.BatchPropertyModifyModal
        hookForm={batchPropertyModify}
      />
      <communityDeleteModal.CommunityDeleteModal hookForm={communityDelete} />
      <propertyCreateModal.PropertyCreateModal hookForm={propertyCreate} />
    </>
  );
};
