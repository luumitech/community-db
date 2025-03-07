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

const AccessModifyMutation = graphql(/* GraphQL */ `
  mutation accessModify($input: AccessModifyInput!) {
    accessModify(input: $input) {
      ...AccessList_Modify
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const ModifyAccessModal: React.FC<Props> = ({ modalControl }) => {
  const [modifyAccess] = useMutation(AccessModifyMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        modifyAccess({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [modifyAccess]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
