import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { CommunityEntry } from '../_type';
import { CommunityDeleteModal } from '../community-delete-modal';
import {
  CommunityModifyModal,
  useHookFormWithDisclosure,
} from '../community-modify-modal';
import { useMoreMenu } from './use-menu';

interface Props {
  fragment: CommunityEntry;
}

export const MoreMenu: React.FC<Props> = ({ fragment }) => {
  const communityModify = useHookFormWithDisclosure(fragment);
  const communityDeleteDisclosure = useDisclosure();
  const menuItems = useMoreMenu({
    communityId: fragment.id,
    modifyButtonProps: communityModify.disclosure.getButtonProps,
    deleteButtonProps: communityDeleteDisclosure.getButtonProps,
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
      <CommunityModifyModal hookForm={communityModify} />
      <CommunityDeleteModal
        disclosure={communityDeleteDisclosure}
        fragment={fragment}
      />
    </>
  );
};
