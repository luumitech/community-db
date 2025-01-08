import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { insertIf } from '~/lib/insert-if';
import { HeaderMenu } from '~/view/header';
import { useMenuItem } from './use-menu-item';

export { useMenuItem as useBaseMenuItem } from './use-menu-item';

interface Props {
  omitKeys?: string[];
}

export const MoreMenu: React.FC<Props> = ({ omitKeys }) => {
  const { canEdit, isAdmin } = useAppContext();
  const menuItems = useMenuItem({});

  return (
    <HeaderMenu
      menuItems={menuItems}
      menuKeys={[
        'communityWelcome',
        'divider',
        'communitySelect',
        'communityCreate',
      ]}
      // shortcutKeys={[]}
      omitKeys={omitKeys}
    />
  );
};
