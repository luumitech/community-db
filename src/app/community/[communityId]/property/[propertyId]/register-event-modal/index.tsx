import { useMutation } from '@apollo/client';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useModalArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const RegisterEventMutation = graphql(/* GraphQL */ `
  mutation registerEvent($input: RegisterEventInput!) {
    registerEvent(input: $input) {
      # Modifying membership may change minYear/maxYear
      community {
        id
        minYear
        maxYear
      }
      property {
        ...PropertyId_MembershipEditor

        # For sending confirmation email to members
        occupantList {
          firstName
          lastName
          email
        }
      }
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const RegisterEventModal: React.FC<Props> = ({ modalControl }) => {
  const [updateProperty] = useMutation(RegisterEventMutation);
  const { modalArg, disclosure } = modalControl;
  const { sendMail } = usePageContext();

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;
      await toast.promise(
        updateProperty({
          variables: { input },
          update: (cache, { data }) => {
            const communityId = data?.registerEvent.community.id;
            if (communityId) {
              evictCache(cache, 'CommunityStat', communityId);
            }
          },
          onCompleted: (data) => {
            // Show email confirmation only when registering for the first event
            if (hidden.isFirstEvent && hidden.canRegister) {
              const { occupantList } = data.registerEvent.property;
              const canSendEmail = occupantList.some(
                ({ email }) => !!email?.trim()
              );
              // Check if there are valid email addresses
              if (canSendEmail) {
                sendMail.open({
                  membershipYear: input.membership.year,
                  occupantList,
                });
              }
            }
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [sendMail, updateProperty]
  );

  if (modalArg == null) {
    return null;
  }

  return <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
