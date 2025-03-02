import { useMutation } from '@apollo/client';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useModalArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const PropertyMutation = graphql(/* GraphQL */ `
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
  modalControl: ModalControl;
}

export const MembershipEditorModal: React.FC<Props> = ({ modalControl }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { modalArg, disclosure } = modalControl;

  const onSave = async (_input: InputData) => {
    const { hidden, ...input } = _input;
    await toast.promise(
      updateProperty({
        variables: { input },
        update: (cache, result) => {
          const communityId = result.data?.propertyModify.community.id;
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
  };

  if (modalArg == null) {
    return null;
  }

  return <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
