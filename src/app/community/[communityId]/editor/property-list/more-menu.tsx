import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { CommunityDeleteModal } from './community-delete-modal';
import {
  CommunityModifyModal,
  useHookFormWithDisclosure,
} from './community-modify-modal';

interface Props {
  community: GQL.CommunityFromIdQuery['communityFromId'];
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const communityModify = useHookFormWithDisclosure(community);
  const communityDeleteDisclosure = useDisclosure();

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
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="modify"
            {...communityModify.disclosure.getButtonProps()}
            showDivider
          >
            Modify Community
          </DropdownItem>
          <DropdownItem
            key="import"
            href={appPath('communityImport', { communityId: community.id })}
          >
            Import from Excel
          </DropdownItem>
          <DropdownItem
            key="export"
            href={appPath('communityExport', { communityId: community.id })}
          >
            Export to Excel
          </DropdownItem>
          <DropdownItem
            key="share"
            href={appPath('communityShare', { communityId: community.id })}
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
      <FormProvider {...communityModify.formMethods}>
        <CommunityModifyModal hookForm={communityModify} />
      </FormProvider>
      <CommunityDeleteModal
        disclosure={communityDeleteDisclosure}
        community={community}
      />
    </>
  );
};
