import { DropdownItemProps } from '@heroui/react';

export interface MenuItemEntry extends DropdownItemProps {
  /**
   * Force each menu item's key as string (by default `DropdownItemProps`
   * accepts number as key)
   */
  key: string;
}
