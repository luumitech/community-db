import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { CommunityFromIdDocument } from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModifyModal } from './modify-modal';
import { InputData } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_PropertyEditor
      }
    }
  }
`);

interface Props {}

export const PropertyModifyModal: React.FC<Props> = (props) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { community, propertyModify } = usePageContext();
  const { formMethods } = propertyModify;

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
            { query: CommunityFromIdDocument, variables: { id: community.id } },
          ],
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [formMethods.formState, updateProperty, community]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal onSave={onSave} />
    </FormProvider>
  );
};
