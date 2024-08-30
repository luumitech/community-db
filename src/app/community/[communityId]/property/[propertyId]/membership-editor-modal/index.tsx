import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { InputData, UseHookFormWithDisclosureResult } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_MembershipEditor
    }
  }
`);

interface Props {
  className?: string;
  hookForm: UseHookFormWithDisclosureResult;
}

export const MembershipEditorModal: React.FC<Props> = ({
  className,
  hookForm,
}) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods, disclosure, fragment } = hookForm;
  const { formState } = formMethods;
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
        <ModalDialog
          fragment={fragment}
          disclosureProps={disclosure}
          onSave={onSave}
        />
      </FormProvider>
    </div>
  );
};
