import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { useFilterBarContext } from '../property-filter-bar/context';
import { ModifyModal } from './modify-modal';
import {
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';

const BatchPropertyMutation = graphql(/* GraphQL */ `
  mutation batchPropertyModify($input: BatchPropertyModifyInput!) {
    batchPropertyModify(input: $input) {
      id
      updatedAt
      updatedBy {
        ...User
      }
      membershipList {
        year
        isMember
        eventAttendedList {
          eventName
          eventDate
        }
        paymentMethod
      }
    }
  }
`);

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const BatchPropertyModifyModal: React.FC<Props> = ({ hookForm }) => {
  const { communityId, filterArg } = useFilterBarContext();
  const [updateProperty] = useMutation(BatchPropertyMutation);
  const { formMethods } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }

      await toast.promise(
        updateProperty({
          variables: {
            input: {
              filter: { communityId, ...filterArg },
              ...input,
            },
          },
        }),
        {
          pending: 'Saving...',
          success: 'Saved',
        }
      );
    },
    [formMethods.formState, updateProperty, communityId, filterArg]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal hookForm={hookForm} onSave={onSave} />
    </FormProvider>
  );
};
