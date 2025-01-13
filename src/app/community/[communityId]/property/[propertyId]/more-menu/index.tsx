import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
  const { canEdit, isAdmin } = useAppContext();
  const menuItems = useMenuItem();

  return (
    <HeaderMenu
      menuItems={menuItems}
      menuKeys={[
        'propertyList',
        'communityDashboard',
        // 'communityShare',
        // 'exportEmail',
        // 'communityExport',
        'divider',
        ...insertIf(canEdit, 'membershipEditor'),
        ...insertIf(canEdit, 'occupantEditor'),
        'divider',
        ...insertIf(canEdit, 'communityModify'),
        ...insertIf(canEdit, 'modifyProperty'),
        ...insertIf(isAdmin, 'deleteProperty'),
      ]}
      shortcutKeys={['propertyList', 'communityDashboard', 'communityModify']}
    />
  );
};
