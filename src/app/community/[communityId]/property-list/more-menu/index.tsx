import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import * as propertyCreateModal from '../../property-create-modal';
import * as communityDeleteModal from '../community-delete-modal';
import { useMenuItem } from './use-menu-item';

interface Props {
  community: GQL.CommunityFromIdQuery['communityFromId'];
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const { canEdit, isAdmin } = useLayoutContext();

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
