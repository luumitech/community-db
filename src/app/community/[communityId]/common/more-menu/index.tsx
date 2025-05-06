import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

export { useMenuItem as useBaseMenuItem } from './use-menu-item';

interface Props {
  communityId: string;
  omitKeys?: string[];
}

export const MoreMenu: React.FC<Props> = ({ communityId, omitKeys }) => {
  const { canEdit, isAdmin } = useAppContext();
  const menuItems = useMenuItem({ communityId });

  return (
    <HeaderMenu
      menuItems={menuItems}
      menuKeys={[
        'propertyList',
        'communityDashboard',
        'communityShare',
        'communityExport',
        'divider',
        ...insertIf(isAdmin, 'communityImport'),
      ]}
      shortcutKeys={['propertyList', 'communityDashboard', 'communityShare']}
      omitKeys={omitKeys}
    />
  );
};
