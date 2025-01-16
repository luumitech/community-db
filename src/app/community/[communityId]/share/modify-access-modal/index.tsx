import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  AccessModifyMutation,
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const ModifyAccessModal: React.FC<Props> = ({ hookForm }) => {
  const [modifyAccess] = useMutation(AccessModifyMutation);
  const { formMethods, disclosure, fragment } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }
      await toast.promise(
        modifyAccess({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [formMethods.formState, modifyAccess]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal
        disclosure={disclosure}
        onSave={onSave}
        fragment={fragment}
      />
    </FormProvider>
  );
};
