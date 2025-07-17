import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import * as communityDeleteModal from '../community-delete-modal';
import { useMenuItem } from './use-menu-item';

interface Props {
  community: GQL.CommunityFromIdQuery['communityFromId'];
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const { canEdit, isAdmin } = useSelector((state) => state.community);

  const communityDelete = communityDeleteModal.useModalControl();

  const menuItems = useMenuItem({
    communityDeleteOpen: () => communityDelete.open({ community }),
  });

  return (
    <>
      <HeaderMenu
        menuItems={menuItems}
        menuKeys={[
          'communityDashboard',
          'communityShare',
          'contactExport',
          'communityExport',
          'thirdPartyIntegration',
          'communityMapView',
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
          'communityShare',
          'communityModify',
        ]}
      />
      <communityDeleteModal.CommunityDeleteModal
        modalControl={communityDelete}
      />
    </>
  );
};
