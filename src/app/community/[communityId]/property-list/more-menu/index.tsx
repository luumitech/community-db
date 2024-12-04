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
import * as batchPropertyModifyModal from '../batch-property-modify-modal';
import * as communityDeleteModal from '../community-delete-modal';
import * as communityModifyModal from '../community-modify-modal';
import * as propertyCreateModal from '../property-create-modal';
import { useMoreMenu } from './use-menu';

interface Props {
  community: CommunityEntry;
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const communityModify =
    communityModifyModal.useHookFormWithDisclosure(community);
  const batchPropertyModify =
    batchPropertyModifyModal.useHookFormWithDisclosure(community);
  const propertyCreate =
    propertyCreateModal.useHookFormWithDisclosure(community);
  const communityDelete =
    communityDeleteModal.useHookFormWithDisclosure(community);

  const menuItems = useMoreMenu({
    communityId: community.id,
    communityModifyButtonProps: communityModify.disclosure.getButtonProps,
    batchPropertyModifyButtonProps:
      batchPropertyModify.disclosure.getButtonProps,
    propertyCreateButtonProps: propertyCreate.disclosure.getButtonProps,
    communityDeleteButtonProps: communityDelete.disclosure.getButtonProps,
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
      <batchPropertyModifyModal.BatchPropertyModifyModal
        hookForm={batchPropertyModify}
      />
      <communityDeleteModal.CommunityDeleteModal hookForm={communityDelete} />
      <propertyCreateModal.PropertyCreateModal hookForm={propertyCreate} />
    </>
  );
};
