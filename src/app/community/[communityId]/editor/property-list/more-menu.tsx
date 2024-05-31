import { useMutation } from '@apollo/client';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { IoMdMore } from 'react-icons/io';
import { FormProvider } from '~/custom-hooks/hook-form';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { CommunityModifyModal } from './community-modify-modal';
import {
  InputData,
  useHookFormWithDisclosure,
} from './community-modify-modal/use-hook-form';

const EntryFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityModifyModal on Community {
    id
    name
    updatedAt
    updatedBy
  }
`);

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      ...CommunityId_CommunityModifyModal
    }
  }
`);

interface Props {
  entry: FragmentType<typeof EntryFragment>;
}

export const MoreMenu: React.FC<Props> = (props) => {
  const pathname = usePathname();
  const router = useRouter();
  const entry = useFragment(EntryFragment, props.entry);
  const communityModify = useHookFormWithDisclosure(entry);
  const [updateCommunity] = useMutation(CommunityMutation);

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!communityModify.formMethods.formState.isDirty) {
        return;
      }
      await toast.promise(
        updateCommunity({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          success: 'Saved',
        }
      );
    },
    [communityModify.formMethods.formState, updateCommunity]
  );

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
          >
            Modify Community
          </DropdownItem>
          <DropdownItem
            key="import"
            onClick={() => router.push(`${pathname}/../../tool/import-xlsx`)}
          >
            Import
          </DropdownItem>
          <DropdownItem
            key="export"
            onClick={() => router.push(`${pathname}/../../tool/export-xlsx`)}
          >
            Export
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <FormProvider {...communityModify.formMethods}>
        <CommunityModifyModal
          disclosureProps={communityModify.disclosure}
          onSave={onSave}
        />
      </FormProvider>
    </>
  );
};
