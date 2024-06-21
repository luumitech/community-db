import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { useContext } from '~/community/[communityId]/context';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { CommunityEntry } from './_type';
import { CommunityDeleteModal } from './community-delete-modal';
import {
  CommunityModifyModal,
  useHookFormWithDisclosure,
} from './community-modify-modal';

interface Props {
  fragment: CommunityEntry;
}

export const MoreMenu: React.FC<Props> = ({ fragment }) => {
  const { canEdit } = useContext();
  const communityModify = useHookFormWithDisclosure(fragment);
  const communityDeleteDisclosure = useDisclosure();

  const disabledKeys = React.useMemo(() => {
    if (!canEdit) {
      return ['modify', 'import', 'delete'];
    }
  }, [canEdit]);

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            className="text-2xl"
            aria-label="More Menu"
            isIconOnly
            variant="light"
          >
            <Icon icon="more" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          disabledKeys={disabledKeys}
        >
          <DropdownItem
            key="modify"
            {...communityModify.disclosure.getButtonProps()}
            showDivider
          >
            Modify Community
          </DropdownItem>
          <DropdownItem
            key="import"
            href={appPath('communityImport', { communityId: fragment.id })}
          >
            Import from Excel
          </DropdownItem>
          <DropdownItem
            key="export"
            href={appPath('communityExport', { communityId: fragment.id })}
          >
            Export to Excel
          </DropdownItem>
          <DropdownItem
            key="share"
            href={appPath('communityShare', { communityId: fragment.id })}
            endContent={<Icon icon="share" />}
            showDivider
          >
            Share
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            {...communityDeleteDisclosure.getButtonProps()}
          >
            Delete Community
          </DropdownItem>
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
