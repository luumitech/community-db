import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  InputData,
  PropertyMutation,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const PropertyModifyModal: React.FC<Props> = ({ hookForm }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods, disclosure, fragment } = hookForm;

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
      <ModifyModal
        fragment={fragment}
        disclosure={disclosure}
        onSave={onSave}
      />
    </FormProvider>
  );
};
