import { ApolloError, useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { ErrorDialog, toast } from '~/view/base/toastify';
import { extractMailchimpError } from './mailchimp-error-handler';
import { ModifyModal, type ModalArg } from './modify-modal';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const MailchimpMemberModifyMutation = graphql(/* GraphQL */ `
  mutation mailchimpMemberModify($input: MailchimpMemberModifyInput!) {
    mailchimpMemberModify(input: $input) {
      ...MailchimpMember_Modify
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const MemberModifyModal: React.FC<Props> = ({ modalControl }) => {
  const [modifyMember] = useMutation(MailchimpMemberModifyMutation);
  const { arg, disclosure } = modalControl;

  const customModifyMember = React.useCallback(
    async (input: InputData) => {
      try {
        const result = await modifyMember({ variables: { input } });
        return result;
      } catch (err) {
        if (err instanceof ApolloError) {
          const [handledByForm] = extractMailchimpError(err);
          if (handledByForm.length) {
            // Don't show toast, error should be displayed directly on form
            throw err;
          }
        }
        if (err instanceof Error) {
          toast.error(<ErrorDialog error={err} />);
        }
        throw err;
      }
    },
    [modifyMember]
  );

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(customModifyMember(input), {
        // Control error toast explictly in customModifyMember
        error: 'disabled',
        pending: 'Saving...',
        // success: 'Saved',
      });
    },
    [customModifyMember]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
