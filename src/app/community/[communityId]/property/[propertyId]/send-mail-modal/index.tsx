import { useMutation } from '@apollo/client';
import queryString from 'query-string';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { MentionUtil } from '~/view/base/rich-text-editor';
import { toast } from '~/view/base/toastify';
import { createMentionMapping } from './editor-util';
import { ModalDialog, type ModalArg } from './modal-dialog';
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
    const {
      defaultSetting: { membershipEmail },
      hidden,
    } = input;
    const subject = MentionUtil.toPlainText(membershipEmail.subject);
    const message = MentionUtil.toPlainText(membershipEmail.message);
    const url = queryString.stringifyUrl({
      url: `mailto:${hidden.toEmail}`,
      query: { subject, body: message },
    });
    document.location.href = url.toString();
  }, []);

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, defaultSetting, ...input } = _input;
      // Replace mention values with placeholder (so no sensitive info in database)
      const mentionUtil = new MentionUtil(createMentionMapping());
      const { subject, message } = defaultSetting.membershipEmail;
      const result = await toast.promise(
        updateCommunity({
          variables: {
            input: {
              ...input,
              defaultSetting: {
                membershipEmail: {
                  subject: mentionUtil.updateMentionInEditorState(subject),
                  message: mentionUtil.updateMentionInEditorState(message),
                },
              },
            },
          },
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
