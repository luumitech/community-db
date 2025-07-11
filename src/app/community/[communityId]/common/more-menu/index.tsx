import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

export { useMenuItem as useBaseMenuItem } from './use-menu-item';

interface Props {
  omitKeys?: string[];
}

export const MoreMenu: React.FC<Props> = ({ omitKeys }) => {
  const { canEdit, isAdmin } = useSelector((state) => state.community);
  const menuItems = useMenuItem();

  return (
    <HeaderMenu
      menuItems={menuItems}
      menuKeys={[
        'propertyList',
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
      ]}
      shortcutKeys={[
        'propertyList',
        'communityDashboard',
        'communityShare',
        'communityModify',
      ]}
      omitKeys={omitKeys}
    />
  );
};
