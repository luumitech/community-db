import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { CommunityFromIdDocument } from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_PropertyEditor
    }
  }
`);

interface Props {
  communityId: string;
  hookForm: UseHookFormWithDisclosureResult;
}

export const PropertyModifyModal: React.FC<Props> = ({
  communityId,
  hookForm,
}) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }

      await toast.promise(
        updateProperty({
          variables: { input },
          refetchQueries: [
            // Updating property address may cause property to change order within
            // the property list
            { query: CommunityFromIdDocument, variables: { id: communityId } },
          ],
        }),
        {
          pending: 'Saving...',
          success: 'Saved',
        }
      );
    },
    [formMethods.formState, updateProperty, communityId]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal hookForm={hookForm} onSave={onSave} />
    </FormProvider>
  );
};
