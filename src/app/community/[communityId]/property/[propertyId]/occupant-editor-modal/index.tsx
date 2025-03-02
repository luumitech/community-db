import { useMutation } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

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
  className?: string;
}

export const OccupantEditorModal: React.FC<Props> = ({ className }) => {
  const { occupantEditor } = usePageContext();
  const { modalArg, disclosure } = occupantEditor;
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

  return (
    <div className={className}>
      <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />
    </div>
  );
};
