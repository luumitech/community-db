import { useMutation } from '@apollo/client';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useModalArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_OccupantEditor
      }
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const OccupantEditorModal: React.FC<Props> = ({ modalControl }) => {
  const { modalArg, disclosure } = modalControl;
  const [updateProperty] = useMutation(OccupantMutation);

  const onSave = async (input: InputData) => {
    await toast.promise(
      updateProperty({
        variables: { input },
      }),
      {
        pending: 'Saving...',
        // success: 'Saved',
      }
    );
  };

  if (modalArg == null) {
    return null;
  }

  return <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
