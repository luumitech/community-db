import { Button, cn, useDisclosure } from '@heroui/react';
import React from 'react';
import { Drawer } from '~/view/base/drawer';
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
          className="shrink-0"
          variant="light"
          isIconOnly
          onPress={() => onOpenChange()}
        >
          <Icon icon="hamburgerMenu" />
        </Button>
        <div className={cn('truncate', '[writing-mode:vertical-rl]')}>
          {selectedItem.label}
        </div>
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
