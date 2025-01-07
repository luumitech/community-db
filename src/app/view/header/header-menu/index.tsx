import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import {
  HeaderMenuShortcut,
  HeaderMenuShortcutProps,
  type MenuItemEntry,
} from './shortcut';
import { HeaderMenuWrapper } from './wrapper';

export type { MenuItemEntry, MenuItemMap } from './shortcut';

interface Props extends HeaderMenuShortcutProps {
  /**
   * Menu item layout configurations
   *
   * - Render menu items according using keys specified in the array
   * - To render a divider, use the string 'divider'
   */
  menuConfig: string[];
}

export const HeaderMenu: React.FC<Props> = ({
  itemMap,
  shortcutKeys,
  menuConfig,
}) => {
  const menuItems = React.useMemo(() => {
    const result: MenuItemEntry[] = [];
    menuConfig.forEach((key) => {
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
  }, [itemMap, menuConfig]);

  return (
    <HeaderMenuWrapper>
      <ButtonGroup variant="light">
        <HeaderMenuShortcut itemMap={itemMap} shortcutKeys={shortcutKeys} />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              className="text-2xl"
              aria-label="Open Header Menu"
              isIconOnly
            >
              <Icon icon="more" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Header Menu" variant="flat">
            {menuItems.map(({ key, ...entry }) => (
              <DropdownItem key={key} {...entry} />
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    </HeaderMenuWrapper>
  );
};
