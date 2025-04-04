import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  cn,
  useDisclosure,
} from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { MenuOptions } from './menu-options';
import { useCurrentItem } from './use-current-item';

interface Props {
  className?: string;
}

export const TopMenu: React.FC<Props> = ({ className }) => {
  const { isOpen, onOpenChange } = useDisclosure();
  const selectedItem = useCurrentItem();

  return (
    <>
      <div className={cn(className, 'flex items-center h-8')}>
        <FlatButton
          className="px-2"
          icon="hamburgerMenu"
          onClick={onOpenChange}
        />
        {selectedItem.label}
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
