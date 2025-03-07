import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import * as communityModifyModal from '../../community-modify-modal';
import * as batchPropertyModifyModal from '../batch-property-modify-modal';
import * as communityDeleteModal from '../community-delete-modal';
import * as propertyCreateModal from '../property-create-modal';
import { useMenuItem } from './use-menu-item';

interface Props {
  community: GQL.CommunityFromIdQuery['communityFromId'];
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const { canEdit, isAdmin } = useAppContext();

  const communityModify = communityModifyModal.useModalControl();
  const batchPropertyModify = batchPropertyModifyModal.useModalControl();
  const propertyCreate = propertyCreateModal.useModalControl();
  const communityDelete = communityDeleteModal.useModalControl();

  const menuItems = useMenuItem({
    communityId: community.id,
    communityModifyOpen: () => communityModify.open({ community }),
    batchPropertyModifyOpen: () => batchPropertyModify.open({ community }),
    communityDeleteOpen: () => communityDelete.open({ community }),
    propertyCreateOpen: () => propertyCreate.open({ community }),
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
          ...insertIf(canEdit, 'batchPropertyModify'),
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
      <communityModifyModal.CommunityModifyModal
        modalControl={communityModify}
      />
      <batchPropertyModifyModal.BatchPropertyModifyModal
        modalControl={batchPropertyModify}
      />
      <communityDeleteModal.CommunityDeleteModal
        modalControl={communityDelete}
      />
      <propertyCreateModal.PropertyCreateModal modalControl={propertyCreate} />
    </>
  );
};
