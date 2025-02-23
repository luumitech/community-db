import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import {
  InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export {
  useHookFormWithDisclosure,
  type ModifyFragmentType,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      id
      ...CommunityId_CommunityModifyModal
    }
  }
`);

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const CommunityModifyModal: React.FC<Props> = ({ hookForm }) => {
  const [updateCommunity] = useMutation(CommunityMutation);
  const { formMethods } = hookForm;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }

      // hidden is not saved in server
      const { hidden, ...input } = _input;
      await toast.promise(
        updateCommunity({
          variables: { input },
          update: (cache, result) => {
            const communityId = result.data?.communityModify.id;
            if (communityId) {
              evictCache(cache, 'CommunityStat', communityId);
            }
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [formMethods.formState, updateCommunity]
  );

  return (
    <FormProvider {...formMethods}>
      <ModifyModal hookForm={hookForm} onSave={onSave} />
    </FormProvider>
  );
};
