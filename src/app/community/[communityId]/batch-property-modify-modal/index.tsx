import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal, type ModalArg } from './modify-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const BatchPropertyMutation = graphql(/* GraphQL */ `
  mutation batchPropertyModify($input: BatchPropertyModifyInput!) {
    batchPropertyModify(input: $input) {
      community {
        id
        minYear
        maxYear
        ...CommunityId_BatchPropertyModifyModal
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
            ticketList {
              ticketName
              count
              price
              paymentMethod
            }
          }
          price
          paymentMethod
        }
      }
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const BatchPropertyModifyModal: React.FC<Props> = ({ modalControl }) => {
  const [updateProperty] = useMutation(BatchPropertyMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        updateProperty({
          variables: { input },
          update: (cache, result) => {
            const communityId = result.data?.batchPropertyModify.community.id;
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
    [updateProperty]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
