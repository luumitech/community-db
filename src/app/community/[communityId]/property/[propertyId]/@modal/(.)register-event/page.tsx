'use client';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { SuccessDialog } from './success-dialog';
import { type InputData } from './use-hook-form';

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

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function RegisterEvent(props: RouteArgs) {
  const router = useRouter();
  const { communityId, propertyId } = React.use(props.params);
  const [updateProperty] = useMutation(RegisterEventMutation);

  const onSendConfirmation = React.useCallback(
    (membershipYear: string) => {
      router.push(
        appPath('composeMembershipMail', {
          path: { communityId, propertyId },
          query: {
            membershipYear,
          },
        })
      );
    },
    [router, communityId, propertyId]
  );

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, ...input } = _input;
      await toast.promise(
        (async () => {
          const result = await updateProperty({
            variables: { input },
            update: (cache, { data }) => {
              evictCache(cache, 'CommunityStat', communityId);
            },
          });
          return { result };
        })(),
        {
          pending: 'Saving...',
          ...(hidden.isFirstEvent &&
            hidden.canRegister && {
              success: {
                autoClose: 10000, // 10s
                render: ({ data, toastProps }) => (
                  <SuccessDialog
                    registerEvent={data.result.data?.registerEvent}
                    onSend={() => {
                      toastProps.closeToast();
                      onSendConfirmation(input.membership.year.toString());
                    }}
                  />
                ),
              },
            }),
        }
      );
    },
    [communityId, onSendConfirmation, updateProperty]
  );

  return <ModalDialog onSave={onSave} />;
}
