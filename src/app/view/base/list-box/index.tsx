import {
  ListboxItem,
  ListboxSection,
  Listbox as NextUIListbox,
  type ListboxProps as NextUIListboxProps,
} from '@heroui/react';
import React from 'react';

export type { ListboxItemProps as ListBoxItemProps } from '@heroui/react';

type ListBox = typeof ListBoxImpl & {
  Item: typeof ListboxItem;
  Section: typeof ListboxSection;
};

export interface ListBoxProps extends NextUIListboxProps {}

const ListBoxImpl = React.forwardRef<HTMLElement, ListBoxProps>(
  ({ ...props }, ref) => {
    return <NextUIListbox ref={ref} {...props} />;
  }
);
ListBoxImpl.displayName = 'ListBox';

export const ListBox = ListBoxImpl as ListBox;
ListBox.Item = ListboxItem;
ListBox.Section = ListboxSection;
