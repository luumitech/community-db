import {
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Dropdown as NextUIDropdown,
  type DropdownProps as NextUIDropdownProps,
} from '@heroui/react';
import React from 'react';

export type { DropdownItemProps } from '@heroui/react';

type Dropdown = typeof DropdownImpl & {
  Trigger: typeof DropdownTrigger;
  Menu: typeof DropdownMenu;
  Section: typeof DropdownSection;
  Item: typeof DropdownItem;
};

export interface DropdownProps extends NextUIDropdownProps {}

const DropdownImpl = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ ...props }, ref) => {
    return <NextUIDropdown ref={ref} {...props} />;
  }
);
DropdownImpl.displayName = 'Dropdown';

export const Dropdown = DropdownImpl as Dropdown;
Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Section = DropdownSection;
Dropdown.Item = DropdownItem;
