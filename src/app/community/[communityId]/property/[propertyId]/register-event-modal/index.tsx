import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { SuccessDialog } from './success-dialog';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const RegisterEventMutation = graphql(/* GraphQL */ `
  mutation registerEvent($input: RegisterEventInput!) {
    registerEvent(input: $input) {
      # Modifying membership may change minYear/maxYear
      community {
        id
        minYear
        maxYear
        ...SendMail_CommunityModifyModal
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
  const { arg, disclosure } = modalControl;
  const { sendMail } = usePageContext();

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;
      await toast.promise(
        (async () => {
          const result = await updateProperty({
            variables: { input },
            update: (cache, { data }) => {
              const communityId = data?.registerEvent.community.id;
              if (communityId) {
                evictCache(cache, 'CommunityStat', communityId);
              }
            },
          });
          return { result, sendMail };
        })(),
        {
          pending: 'Saving...',
          ...(hidden.isFirstEvent &&
            hidden.canRegister && {
              success: {
                autoClose: 10000, // 10s
                render: ({ data }) => (
                  <SuccessDialog
                    membershipYear={input.membership.year.toString()}
                    registerEvent={data.result.data?.registerEvent}
                    sendMail={data.sendMail}
                  />
                ),
              },
            }),
        }
      );
    },
    [updateProperty, sendMail]
  );

  if (arg == null) {
    return null;
  }

  return <ModalDialog {...arg} disclosure={disclosure} onSave={onSave} />;
};
