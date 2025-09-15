'use client';
import { useMutation } from '@apollo/client';
import queryString from 'query-string';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { MentionUtil } from '~/view/base/rich-text-editor';
import { toast } from '~/view/base/toastify';
import { createMentionMapping } from './editor-util';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

const CommunityMutation = graphql(/* GraphQL */ `
  mutation sendMailCommunityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      id
      ...SendMail_CommunityModifyModal
    }
  }
`);

interface Params {
  communityId: string;
  propertyId: string;
}

interface SearchParams {
  membershipYear: string;
}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function SendMail(props: RouteArgs) {
  const { membershipYear } = React.use(props.searchParams);
  const [updateCommunity] = useMutation(CommunityMutation);

  const onSend = React.useCallback(async (input: InputData) => {
    const {
      defaultSetting: { membershipEmail },
      hidden,
    } = input;
    const { cc } = membershipEmail;
    const subject = MentionUtil.toPlainText(membershipEmail.subject);
    const message = MentionUtil.toPlainText(membershipEmail.message);
    const url = queryString.stringifyUrl({
      url: `mailto:${hidden.toEmail}`,
      query: { subject, body: message, cc },
    });
    document.location.href = url.toString();
  }, []);

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { hidden, defaultSetting, ...input } = _input;
      // Replace mention values with placeholder (so no sensitive info in database)
      const mentionUtil = new MentionUtil(createMentionMapping());
      const { cc, subject, message } = defaultSetting.membershipEmail;
      const result = await toast.promise(
        updateCommunity({
          variables: {
            input: {
              ...input,
              defaultSetting: {
                membershipEmail: {
                  cc,
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

  return (
    <ModalDialog
      membershipYear={membershipYear}
      onSave={onSave}
      onSend={onSend}
    />
  );
}
