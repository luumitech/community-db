import { useMutation } from '@apollo/client';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

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
  className?: string;
}

export const MembershipEditorModal: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { membershipEditor } = usePageContext();
  const { modalArg, disclosure } = membershipEditor;

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

  return (
    <div className={className}>
      <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />
    </div>
  );
};
