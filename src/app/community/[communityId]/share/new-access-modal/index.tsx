import { useMutation } from '@apollo/client';
import { produce } from 'immer';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { CreateModal, type ModalArg } from './create-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './create-modal';
export const useModalControl = useModalArg<ModalArg>;
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
  const { modalArg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;

      await toast.promise(
        createAccess({
          variables: { input },
          updateQueries: {
            communityAccessList: (prev, { mutationResult, queryVariables }) => {
              const result = produce(prev, (draft) => {
                const newEntry = mutationResult.data?.accessCreate;
                if (newEntry) {
                  draft.communityFromId.otherAccessList.push(newEntry);
                }
              });
              return result;
            },
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [createAccess]
  );

  if (modalArg == null) {
    return null;
  }

  return <CreateModal {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
