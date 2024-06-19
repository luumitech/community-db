import { useMutation } from '@apollo/client';
import { produce } from 'immer';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { toast } from '~/view/base/toastify';
import { CreateModal } from './create-modal';
import {
  AccessCreateMutation,
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const NewAccessModal: React.FC<Props> = ({ hookForm }) => {
  const [createAccess] = useMutation(AccessCreateMutation);
  const { formMethods, disclosure } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }

      await toast.promise(
        createAccess({
          variables: { input },
          updateQueries: {
            communityAccessList: (prev, { mutationResult, queryVariables }) => {
              const result = produce(prev, (draft) => {
                const newEntry = mutationResult.data?.accessCreate;
                if (newEntry) {
                  draft.communityFromId.accessList.push(newEntry);
                }
              });
              return result;
            },
          },
        }),
        {
          pending: 'Saving...',
          success: 'Saved',
        }
      );
    },
    [formMethods.formState, createAccess]
  );

  return (
    <FormProvider {...formMethods}>
      <CreateModal disclosure={disclosure} onSave={onSave} />
    </FormProvider>
  );
};
