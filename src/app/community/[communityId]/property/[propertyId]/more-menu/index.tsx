import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useItemMap } from './use-item-map';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
  const { canEdit, isAdmin } = useAppContext();
  const itemMap = useItemMap();

  const menuConfig = [
    'propertyList',
    // 'communityDashboard',
    // 'communityShare',
    // 'exportEmail',
    // 'communityExport',
    'divider',
    ...insertIf(canEdit, 'membershipEditor'),
    ...insertIf(canEdit, 'occupantEditor'),
    'divider',
    ...insertIf(canEdit, 'modifyProperty'),
    ...insertIf(isAdmin, 'deleteProperty'),
  ];

  const shortcutKeys = ['propertyList'];

  return (
    <HeaderMenu
      itemMap={itemMap}
      menuConfig={menuConfig}
      shortcutKeys={shortcutKeys}
    />
  );
};
