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
import { MoreMenuShortcut, MoreMenuWrapper } from '~/view/header';
import { useMoreMenu } from './use-menu';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
  const menuItems = useMoreMenu();

  return (
    <MoreMenuWrapper>
      <ButtonGroup variant="light">
        <MoreMenuShortcut items={menuItems} itemKeys={['property-list']} />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button className="text-2xl" aria-label="Open More Menu" isIconOnly>
              <Icon icon="more" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="More Menu" variant="flat">
            {menuItems.map(({ key, ...entry }) => (
              <DropdownItem key={key} {...entry} />
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    </MoreMenuWrapper>
  );
};
