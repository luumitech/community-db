import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { z, zz } from '~/lib/zod';
import { type OccupantList } from './_type';
import { createMentionMapping } from './message-editor';
import { MentionUtil } from './rich-text-editor';

const ModifyFragment = graphql(/* GraphQL */ `
  fragment SendMail_CommunityModifyModal on Community {
    id
    defaultSetting {
      membershipEmail {
        message
        subject
      }
    }
    updatedAt
    updatedBy {
      ...User
    }
  }
`);
export type ModifyFragmentType = FragmentType<typeof ModifyFragment>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    subject: zz.string.nonEmpty('Please enter a subject'),
    toEmail: zz.string.nonEmpty('Please select at least one recipient'),
    messageEditorState: z.string(),
    hidden: z.object({
      membershipYear: z.string(),
      /** SelectItems for To: email recipients */
      toItems: z.array(
        z.object({
          email: z.string(),
          firstName: z.string(),
          fullName: z.string(),
        })
      ),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

/**
 * This is the EditorState for:
 *
 *     Hi @Name1, Name2,
 *
 *     Thank you for submitting your @2025 membership fee. We would like to confirm
 *     that we have received the payment and have successfully updated your membership
 *     status in our records.
 *
 *     Best regards,
 */
const defaultMessageEditorState = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Hi ',
            type: 'text',
            version: 1,
          },
          {
            trigger: '@',
            value: 'member names',
            data: {
              varname: 'Member Names',
            },
            type: 'beautifulMention',
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: ',',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Thank you for submitting your ',
            type: 'text',
            version: 1,
          },
          {
            trigger: '@',
            value: 'year',
            data: {
              varname: 'Membership Year',
            },
            type: 'beautifulMention',
            version: 1,
          },
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: ' membership fee. We would like to confirm that we have received the payment and have successfully updated your membership status in our records.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Best regards,',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
        textStyle: '',
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

export function defaultInputData(
  fragment: ModifyFragmentType,
  membershipYear: string,
  occupantList: OccupantList
): InputData {
  const community = getFragment(ModifyFragment, fragment);
  const toItems: InputData['hidden']['toItems'] = [];
  occupantList.forEach((entry) => {
    if (entry.email) {
      const fullName =
        `${entry.firstName ?? ''} ${entry.lastName ?? ''}`.trim() || 'n/a';
      toItems.push({
        email: entry.email,
        firstName: (entry.firstName ?? '').trim() || 'n/a',
        fullName,
      });
    }
  });
  const toEmail = toItems.map(({ email }) => email).join(',');
  const mentionUtil = new MentionUtil(
    createMentionMapping(membershipYear, toItems, toEmail)
  );

  return {
    self: {
      id: community.id,
      updatedAt: community.updatedAt,
    },
    subject:
      community.defaultSetting?.membershipEmail?.subject ??
      'Membership Registration Confirmation',
    toEmail,
    messageEditorState: mentionUtil.updateMentionInEditorState(
      community.defaultSetting?.membershipEmail?.message ??
        defaultMessageEditorState
    ),
    hidden: {
      membershipYear,
      toItems,
    },
  };
}

export function useHookForm(
  fragment: ModifyFragmentType,
  membershipYear: string,
  occupantList: OccupantList
) {
  const defaultValues = React.useMemo(() => {
    return defaultInputData(fragment, membershipYear, occupantList);
  }, [fragment, membershipYear, occupantList]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
