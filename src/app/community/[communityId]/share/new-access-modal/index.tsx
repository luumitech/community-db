import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { CreateModal, type ModalArg } from './create-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './create-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const AccessCreateMutation = graphql(/* GraphQL */ `
  mutation accessCreate($input: AccessCreateInput!) {
    accessCreate(input: $input) {
      id
      ...AccessList_User
      ...AccessList_Role
      ...AccessList_Modify
      ...AccessList_Delete
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const NewAccessModal: React.FC<Props> = ({ modalControl }) => {
  const [createAccess] = useMutation(AccessCreateMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;

      await toast.promise(
        createAccess({
          variables: { input },
          refetchQueries: [
            // adding access creates new entry in access list
            {
              query: GQL.CommunityAccessListDocument,
              variables: { id: input.communityId },
            },
          ],
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [createAccess]
  );

  if (arg == null) {
    return null;
  }

  return <CreateModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
