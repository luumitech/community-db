import { DropdownItemProps } from '@nextui-org/react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '~/view/base/button';

interface Props {
  /** Available list of menu items */
  items: DropdownItemProps[];
  /** List of items to create shortcuts for */
  itemKeys: string[];
}

export const MoreMenuShortcut: React.FC<Props> = ({ items, itemKeys }) => {
  const router = useRouter();
  const isSmallDevice = useMediaQuery('(max-width: 640px)');

  if (isSmallDevice) {
    return null;
  }

  return itemKeys
    .map((key) => {
      const menuItem = items.find((item) => item.key === key);
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
