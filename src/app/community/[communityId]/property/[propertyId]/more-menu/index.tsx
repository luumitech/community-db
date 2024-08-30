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
import type { CommunityEntry, PropertyEntry } from '../_type';
import * as membershipEditorModal from '../membership-editor-modal';
import * as occupantEditorModal from '../occupant-editor-modal';
import { PropertyDeleteModal } from '../property-delete-modal';
import * as propertyModifyModal from '../property-modify-modal';
import { useMoreMenu } from './use-menu';

interface Props {
  community: CommunityEntry;
  property: PropertyEntry;
  propertyModify: propertyModifyModal.UseHookFormWithDisclosureResult;
  membershipEditor: membershipEditorModal.UseHookFormWithDisclosureResult;
  occupantEditor: occupantEditorModal.UseHookFormWithDisclosureResult;
}

export const MoreMenu: React.FC<Props> = ({
  community,
  property,
  propertyModify,
  membershipEditor,
  occupantEditor,
}) => {
  const propertyDeleteDisclosure = useDisclosure();
  const menuItems = useMoreMenu({
    propertyId: property.id,
    propertyModifyButtonProps: propertyModify.disclosure.getButtonProps,
    membershipEditorButtonProps: membershipEditor.disclosure.getButtonProps,
    occupantEditorButtonProps: occupantEditor.disclosure.getButtonProps,
    deleteButtonProps: propertyDeleteDisclosure.getButtonProps,
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
      <PropertyDeleteModal
        disclosure={propertyDeleteDisclosure}
        communityId={community.id}
        fragment={property}
      />
    </>
  );
};
