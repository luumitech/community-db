import {
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Dropdown as NextUIDropdown,
} from '@heroui/react';

type Dropdown = typeof NextUIDropdown & {
  Trigger: typeof DropdownTrigger;
  Menu: typeof DropdownMenu;
  Section: typeof DropdownSection;
  Item: typeof DropdownItem;
};

export const Dropdown = NextUIDropdown as Dropdown;
Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Section = DropdownSection;
Dropdown.Item = DropdownItem;
