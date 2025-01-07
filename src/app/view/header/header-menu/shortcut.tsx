import { DropdownItemProps } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '~/view/base/button';

export interface MenuItemEntry extends DropdownItemProps {}
export type MenuItemMap = Map<string, MenuItemEntry>;

export interface HeaderMenuShortcutProps {
  /** Map of menu items and their configurations */
  itemMap: MenuItemMap;
  /** List of menu item key(s) to create shortcuts for */
  shortcutKeys: string[];
}

export const HeaderMenuShortcut: React.FC<HeaderMenuShortcutProps> = ({
  itemMap,
  shortcutKeys,
}) => {
  const router = useRouter();
  const isSmallDevice = useMediaQuery('(max-width: 640px)');

  if (isSmallDevice) {
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
          key={menuItem.key}
          isIconOnly={hasIcon}
          {...(hasIcon && { tooltip })}
          onPress={menuItem.onPress ?? (() => router.push(menuItem.href!))}
        >
          {menuItem.endContent ?? menuItem.children}
        </Button>
      );
    })
    .filter((item): item is React.JSX.Element => item !== null);
};
