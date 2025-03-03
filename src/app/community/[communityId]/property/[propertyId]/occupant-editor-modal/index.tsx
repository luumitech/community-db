import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useDisclosureWithArg<ModalArg>;
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
  const { arg, disclosure } = modalControl;
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

  if (arg == null) {
    return null;
  }

  return <ModalDialog {...arg} disclosure={disclosure} onSave={onSave} />;
};
