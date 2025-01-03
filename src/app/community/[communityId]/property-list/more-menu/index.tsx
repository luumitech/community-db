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
    communityModifyDisclosure: communityModify.disclosure,
    batchPropertyModifyDisclosure: batchPropertyModify.disclosure,
    propertyCreateDisclosure: propertyCreate.disclosure,
    communityDeleteDisclosure: communityDelete.disclosure,
  });

  return (
    <MoreMenuWrapper>
      <ButtonGroup variant="light">
        <MoreMenuShortcut
          items={menuItems}
          itemKeys={['communityDashboard', 'communityModify', 'communityShare']}
        />
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
      <communityModifyModal.CommunityModifyModal hookForm={communityModify} />
      <batchPropertyModifyModal.BatchPropertyModifyModal
        hookForm={batchPropertyModify}
      />
      <communityDeleteModal.CommunityDeleteModal hookForm={communityDelete} />
      <propertyCreateModal.PropertyCreateModal hookForm={propertyCreate} />
    </MoreMenuWrapper>
  );
};
