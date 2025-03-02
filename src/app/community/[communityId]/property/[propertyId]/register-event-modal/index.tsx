import { useMutation } from '@apollo/client';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

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
  className?: string;
}

export const RegisterEventModal: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(RegisterEventMutation);
  const { registerEvent, sendMail } = usePageContext();
  const { modalArg, disclosure } = registerEvent;

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

  return (
    <div className={className}>
      <ModalDialog {...modalArg} disclosure={disclosure} onSave={onSave} />
    </div>
  );
};
