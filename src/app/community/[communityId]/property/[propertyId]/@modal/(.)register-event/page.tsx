'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
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
  const [updateProperty] = useMutation(RegisterEventMutation);

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
                    membershipYear={input.membership.year.toString()}
                    registerEvent={data.result.data?.registerEvent}
                    closeToast={toastProps.closeToast}
                  />
                ),
              },
            }),
        }
      );
    },
    [updateProperty]
  );

  return <ModalDialog onSave={onSave} />;
}
