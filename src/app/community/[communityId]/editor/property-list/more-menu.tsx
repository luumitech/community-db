import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { IoMdMore } from 'react-icons/io';
import { FormProvider } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { CommunityDeleteModal } from './community-delete-modal';
import {
  CommunityModifyModal,
  useHookFormWithDisclosure,
} from './community-modify-modal';

interface Props {
  community: GQL.CommunityFromIdQuery['communityFromId'];
}

export const MoreMenu: React.FC<Props> = ({ community }) => {
  const pathname = usePathname();
  const router = useRouter();
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
            <IoMdMore />
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
            onClick={() =>
              router.push(`${pathname}/../../management/import-xlsx`)
            }
          >
            Import from Excel
          </DropdownItem>
          <DropdownItem
            key="export"
            onClick={() =>
              router.push(`${pathname}/../../management/export-xlsx`)
            }
            showDivider
          >
            Export to Excel
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            {...communityDeleteDisclosure.getButtonProps()}
            showDivider
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
