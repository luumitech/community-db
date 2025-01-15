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

export const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      # Modifying membership may change minYear/maxYear
      community {
        id
        minYear
        maxYear
      }
      property {
        ...PropertyId_MembershipEditor
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const MembershipEditorModal: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { membershipEditor } = usePageContext();
  const { formMethods } = membershipEditor;
  const { formState } = formMethods;
  const onSave = async (_input: InputData) => {
    if (!formState.isDirty) {
      return;
    }
    const { hidden, ...input } = _input;
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

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        <ModalDialog onSave={onSave} />
      </FormProvider>
    </div>
  );
};
