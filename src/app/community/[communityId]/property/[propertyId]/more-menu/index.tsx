import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { useMoreMenu } from './use-menu';

interface Props {}

export const MoreMenu: React.FC<Props> = (props) => {
  const menuItems = useMoreMenu();

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            className="text-2xl"
            aria-label="Open More Menu"
            isIconOnly
            variant="light"
          >
            <Icon icon="more" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="More Menu" variant="flat">
          {menuItems.map(({ key, ...entry }) => (
            <DropdownItem key={key} {...entry} />
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
