import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export {
  useHookFormWithDisclosure,
  type BatchPropertyModifyFragmentType,
} from './use-hook-form';

const BatchPropertyMutation = graphql(/* GraphQL */ `
  mutation batchPropertyModify($input: BatchPropertyModifyInput!) {
    batchPropertyModify(input: $input) {
      community {
        id
        minYear
        maxYear
      }
      propertyList {
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
  }
`);

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const BatchPropertyModifyModal: React.FC<Props> = ({ hookForm }) => {
  const [updateProperty] = useMutation(BatchPropertyMutation);
  const { formMethods } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
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
    },
    [formMethods.formState, updateProperty]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal hookForm={hookForm} onSave={onSave} />
    </FormProvider>
  );
};
