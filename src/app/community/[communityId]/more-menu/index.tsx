import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useItemMap } from './use-item-map';

interface Props {
  communityId: string;
  omitKeys?: string[];
}

export const MoreMenu: React.FC<Props> = ({ communityId, omitKeys }) => {
  const { canEdit, isAdmin } = useAppContext();
  const itemMap = useItemMap({ communityId });

  const menuConfig = [
    'propertyList',
    'communityDashboard',
    'communityShare',
    'exportEmail',
    'communityExport',
    'divider',
    ...insertIf(isAdmin, 'communityImport'),
  ];

  const shortcutKeys = ['propertyList', 'communityDashboard', 'communityShare'];

  return (
    <HeaderMenu
      itemMap={itemMap}
      shortcutKeys={shortcutKeys.filter((key) => !omitKeys?.includes(key))}
      menuConfig={menuConfig.filter((key) => !omitKeys?.includes(key))}
    />
  );
};
