import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
  const { canEdit, isAdmin } = useLayoutContext();
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
        'divider',
        ...insertIf(canEdit, 'membershipEditor'),
        ...insertIf(canEdit, 'occupantEditor'),
        'divider',
        ...insertIf(canEdit, 'communityModify'),
        ...insertIf(canEdit, 'propertyModify'),
        ...insertIf(isAdmin, 'propertyDelete'),
      ]}
      shortcutKeys={['propertyList', 'communityDashboard', 'communityModify']}
    />
  );
};
