import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  CommunityMutation,
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const CommunityModifyModal: React.FC<Props> = ({ hookForm }) => {
  const [updateCommunity] = useMutation(CommunityMutation);
  const { formMethods, disclosure } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }
      await toast.promise(
        updateCommunity({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          success: 'Saved',
        }
      );
    },
    [formMethods.formState, updateCommunity]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal disclosure={disclosure} onSave={onSave} />
    </FormProvider>
  );
};
