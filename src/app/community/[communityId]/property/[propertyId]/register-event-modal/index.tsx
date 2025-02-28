import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { SendMailConfirmation } from '../send-mail-modal';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

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
  const { formMethods } = registerEvent;

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
    [updateProperty]
  );

  return (
    <div className={className}>
      <FormProvider {...formMethods}>
        <ModalDialog onSave={onSave} />
      </FormProvider>
      <SendMailConfirmation />
    </div>
  );
};
