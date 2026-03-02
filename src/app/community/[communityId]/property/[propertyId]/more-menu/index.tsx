import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
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
        ...insertIf(canEdit, 'membershipEditor'),
        ...insertIf(canEdit, 'occupancyEditor'),
        'divider',
        ...insertIf(canEdit, 'communityModify'),
        ...insertIf(canEdit, 'batchPropertyModify'),
        ...insertIf(canEdit, 'propertyModify'),
        ...insertIf(isAdmin, 'propertyCreate'),
        ...insertIf(isAdmin, 'propertyDelete'),
      ]}
      shortcutKeys={['propertyList', 'communityDashboard', 'communityModify']}
    />
  );
};
