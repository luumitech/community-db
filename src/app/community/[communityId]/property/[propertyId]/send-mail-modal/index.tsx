import { useMutation } from '@apollo/client';
import queryString from 'query-string';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { createMentionMapping } from './message-editor';
import { ModalDialog, type ModalArg } from './modal-dialog';
import { MentionUtil } from './rich-text-editor';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './modal-dialog';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const CommunityMutation = graphql(/* GraphQL */ `
  mutation sendMailCommunityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      id
      ...SendMail_CommunityModifyModal
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const SendMailModal: React.FC<Props> = ({ modalControl }) => {
  const [updateCommunity] = useMutation(CommunityMutation);
  const { arg, disclosure } = modalControl;

  const onSend = React.useCallback(async (input: InputData) => {
    const { toEmail, messageEditorState, subject, hidden } = input;
    const mentionUtil = new MentionUtil(
      createMentionMapping(hidden.membershipYear, hidden.toItems, toEmail)
    );
    const message = mentionUtil.toPlainText(messageEditorState);
    const url = queryString.stringifyUrl({
      url: `mailto:${toEmail}`,
      query: { subject, body: message },
    });
    document.location.href = url.toString();
  }, []);

  const onSave = React.useCallback(
    async (input: InputData) => {
      const { self, subject, messageEditorState } = input;
      const defaultSetting = {
        membershipEmail: { subject, message: messageEditorState },
      };
      const result = await toast.promise(
        updateCommunity({
          variables: { input: { self, defaultSetting } },
        }),
        {
          pending: 'Saving...',
          success: 'Email Template Saved',
        }
      );
      return result?.data?.communityModify;
    },
    [updateCommunity]
  );

  if (arg == null) {
    return null;
  }

  return (
    <ModalDialog
      {...arg}
      disclosure={disclosure}
      onSave={onSave}
      onSend={onSend}
    />
  );
};
