import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { CommunityEntry } from '../_type';
import * as communityDeleteModal from '../community-delete-modal';
import * as communityModifyModal from '../community-modify-modal';
import * as propertyCreateModal from '../property-create-modal';
import { useMoreMenu } from './use-menu';

interface Props {
  fragment: CommunityEntry;
}

export const MoreMenu: React.FC<Props> = ({ fragment }) => {
  const communityModify =
    communityModifyModal.useHookFormWithDisclosure(fragment);
  const communityDelete =
    communityDeleteModal.useHookFormWithDisclosure(fragment);
  const propertyCreate =
    propertyCreateModal.useHookFormWithDisclosure(fragment);
  const menuItems = useMoreMenu({
    communityId: fragment.id,
    communityModifyButtonProps: communityModify.disclosure.getButtonProps,
    communityDeleteButtonProps: communityDelete.disclosure.getButtonProps,
    propertyCreateButtonProps: propertyCreate.disclosure.getButtonProps,
  });

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
      <communityModifyModal.CommunityModifyModal hookForm={communityModify} />
      <communityDeleteModal.CommunityDeleteModal hookForm={communityDelete} />
      <propertyCreateModal.PropertyCreateModal hookForm={propertyCreate} />
    </>
  );
};
