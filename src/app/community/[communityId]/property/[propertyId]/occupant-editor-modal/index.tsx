import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_OccupantEditor
    }
  }
`);

interface Props {
  className?: string;
}

export const OccupantEditorModal: React.FC<Props> = ({ className }) => {
  const { occupantEditor } = usePageContext();
  const { formMethods } = occupantEditor;
  const { formState } = formMethods;
  const [updateProperty] = useMutation(OccupantMutation);

  const onSave = async (input: InputData) => {
    if (!formState.isDirty) {
      return;
    }
    await toast.promise(
      updateProperty({
        variables: { input },
      }),
      {
        pending: 'Saving...',
        success: 'Saved',
      }
    );
  };

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        <ModalDialog onSave={onSave} />
      </FormProvider>
    </div>
  );
};
