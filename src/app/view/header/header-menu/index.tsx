import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import type { MenuItemEntry } from './_type';
import { HeaderMenuShortcut } from './shortcut';
import { HeaderMenuWrapper } from './wrapper';

export type { MenuItemEntry } from './_type';

interface Props {
  /** List of available menu items and their configurations */
  menuItems: MenuItemEntry[];
  /**
   * List of menu item key(s) to create menu items for.
   *
   * - The list of keys renders the menu from top to bottom
   * - To render a divider, use the string 'divider'
   */
  menuKeys: string[];
  /**
   * List of menu item key(s) to create shortcuts for.
   *
   * Shortcuts are displayed on the left side of the 'more icon' button
   */
  shortcutKeys?: string[];
  /**
   * List of menu item key(s) to omit from the menu.
   *
   * Useful for hiding menu item that points to the current route
   */
  omitKeys?: string[];
}

export const HeaderMenu: React.FC<Props> = ({
  menuItems,
  menuKeys,
  shortcutKeys,
  omitKeys,
}) => {
  const itemMap = React.useMemo(() => {
    const result = new Map<string, MenuItemEntry>();
    menuItems.forEach((item) => {
      if (!omitKeys?.includes(item.key)) {
        result.set(item.key, item);
      }
    });
    return result;
  }, [menuItems, omitKeys]);

  const menuItemsWithDivider = React.useMemo(() => {
    const result: MenuItemEntry[] = [];
    menuKeys.forEach((key) => {
      if (key === 'divider') {
        const prevItem = result[result.length - 1];
        if (prevItem) {
          prevItem.showDivider = true;
        }
      } else {
        const item = itemMap.get(key);
        if (item) {
          result.push(item);
        }
      }
    });

    // Don't put divider after last menu item
    const lastItem = result[result.length - 1];
    if (lastItem?.showDivider) {
      lastItem.showDivider = false;
    }
    return result;
  }, [itemMap, menuKeys]);

  return (
    <HeaderMenuWrapper>
      <ButtonGroup variant="light">
        <HeaderMenuShortcut
          itemMap={itemMap}
          shortcutKeys={shortcutKeys ?? []}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              className="text-2xl"
              aria-label="Open Header More Menu"
              isIconOnly
            >
              <Icon icon="more" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Header More Menu" variant="flat">
            {menuItemsWithDivider.map(({ key, ...entry }) => (
              <DropdownItem key={key} {...entry} />
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    </HeaderMenuWrapper>
  );
};
