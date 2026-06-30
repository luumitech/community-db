import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal, type ModalArg } from './modify-modal';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const CommunityOwnerModifyMutation = graphql(/* GraphQL */ `
  mutation communityOwnerModify($input: CommunityModifyOwnerInput!) {
    communityOwnerModify(input: $input) {
      ...CommunityOwner_Modify
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const ModifyOwnershipModal: React.FC<Props> = ({ modalControl }) => {
  const [modifyOwner] = useMutation(CommunityOwnerModifyMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        modifyOwner({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [modifyOwner]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
