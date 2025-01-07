import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import * as batchPropertyModifyModal from '../batch-property-modify-modal';
import * as communityDeleteModal from '../community-delete-modal';
import * as communityModifyModal from '../community-modify-modal';
import * as propertyCreateModal from '../property-create-modal';
import { useItemMap } from './use-item-map';

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

  const itemMap = useItemMap({
    communityId: communityModify.community.id,
    communityModifyDisclosure: communityModify.disclosure,
    batchPropertyModifyDisclosure: batchPropertyModify.disclosure,
    communityDeleteDisclosure: communityDelete.disclosure,
    propertyCreateDisclosure: propertyCreate.disclosure,
  });

  const menuConfig = [
    'propertyList',
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
  ];

  const shortcutKeys = ['propertyList', 'communityDashboard', 'communityShare'];

  return (
    <>
      <HeaderMenu
        itemMap={itemMap}
        menuConfig={menuConfig}
        shortcutKeys={shortcutKeys}
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
