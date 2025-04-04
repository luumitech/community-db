import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  cn,
  useDisclosure,
} from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { MenuOptions } from './menu-options';
import { useCurrentItem } from './use-current-item';

interface Props {
  className?: string;
}

export const SmallMenu: React.FC<Props> = ({ className }) => {
  const { isOpen, onOpenChange } = useDisclosure();
  const selectedItem = useCurrentItem();

  return (
    <>
      <div className={cn(className, 'flex flex-col items-center')}>
        <Button
          className="flex-shrink-0"
          variant="light"
          isIconOnly
          onPress={() => onOpenChange()}
        >
          <Icon icon="hamburgerMenu" />
        </Button>
        <div
          className={cn(
            'text-ellipsis overflow-hidden whitespace-nowrap',
            '[writing-mode:vertical-rl]'
          )}
        >
          {selectedItem.label}
        </div>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent className="max-w-xs">
          {(onClose) => (
            <>
              <DrawerHeader>Step-By-Step Guides</DrawerHeader>
              <DrawerBody>
                <MenuOptions onSelect={() => onClose()} />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
