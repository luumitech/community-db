import { useRouter } from 'next/navigation';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Button } from '~/view/base/button';
import type { MenuItemEntry } from './_type';

export type MenuItemMap = Map<string, MenuItemEntry>;

interface Props {
  /**
   * List of available menu items and their configurations, mapped by each menu
   * item's key
   */
  itemMap: MenuItemMap;
  /**
   * List of menu item key(s) to create shortcuts for.
   *
   * Shortcuts are displayed on the left side of the 'more icon' button
   */
  shortcutKeys: string[];
}

export const HeaderMenuShortcut: React.FC<Props> = ({
  itemMap,
  shortcutKeys,
}) => {
  const router = useRouter();
  const { isSmDevice } = useAppContext();

  if (isSmDevice) {
    return null;
  }

  return shortcutKeys
    .map((key) => {
      const menuItem = itemMap.get(key);
      if (!menuItem) {
        return null;
      }
      const hasIcon = !!menuItem.endContent;
      const tooltip = menuItem.children as string;
      return (
        <Button
          className="text-lg"
          key={menuItem.key}
          isIconOnly={hasIcon}
          {...(!!tooltip && { tooltip })}
          onPress={menuItem.onPress ?? (() => router.push(menuItem.href!))}
        >
          {menuItem.endContent ?? menuItem.children}
        </Button>
      );
    })
    .filter((item): item is React.JSX.Element => item !== null);
};
