import { cn, useDisclosure } from '@heroui/react';
import React from 'react';
import { Drawer } from '~/view/base/drawer';
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
      <div className={cn(className, 'flex h-8 items-center')}>
        <FlatButton
          className="px-2"
          icon="hamburgerMenu"
          onClick={onOpenChange}
        />
        {selectedItem.label}
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <Drawer.Content className="max-w-xs">
          {(onClose) => (
            <>
              <Drawer.Header>Step-By-Step Guides</Drawer.Header>
              <Drawer.Body>
                <MenuOptions onSelect={() => onClose()} />
              </Drawer.Body>
            </>
          )}
        </Drawer.Content>
      </Drawer>
    </>
  );
};
