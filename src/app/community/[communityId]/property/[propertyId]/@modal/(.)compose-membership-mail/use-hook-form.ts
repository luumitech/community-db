import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { type PropertyEntry } from '~/community/[communityId]/property/[propertyId]/_type';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { z, zz } from '~/lib/zod';
import { MentionUtil } from '~/view/base/rich-text-editor';
import { useLayoutContext } from '../../layout-context';
import { OccupantDisplayFragment } from '../../view/occupant-display';
import { createMentionMapping, createMentionValues } from './editor-util';

const ModifyFragment = graphql(/* GraphQL */ `
  fragment SendMail_CommunityModifyModal on Community {
    id
    defaultSetting {
      membershipEmail {
        message
        cc
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
    defaultSetting: z.object({
      // subject and message keeps editor state
      membershipEmail: z.object({
        subject: z.string(),
        cc: z.array(z.string()),
        message: z.string(),
      }),
    }),
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
      /** Actual selected emails */
      toEmail: zz.string.nonEmpty('Please select at least one recipient'),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

/**
 * This is the EditorState for:
 *
 *     Membership Registration Confirmation
 */
const defaultSubject = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Membership Registration Confirmation',
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
const defaultMessage = JSON.stringify({
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
            value: 'o',
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
            value: 'o',
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
  propertyFragment: PropertyEntry,
  membershipYear: string
): InputData {
  const community = getFragment(ModifyFragment, fragment);
  const property = getFragment(OccupantDisplayFragment, propertyFragment);
  const toItems: InputData['hidden']['toItems'] = [];

  property.occupantList.forEach((entry) => {
    if (entry.email?.trim()) {
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
  const mentionValues = createMentionValues(membershipYear, toItems, toEmail);
  const mentionUtil = new MentionUtil(createMentionMapping(mentionValues));

  return {
    self: {
      id: community.id,
      updatedAt: community.updatedAt,
    },
    defaultSetting: {
      membershipEmail: {
        subject: mentionUtil.updateMentionInEditorState(
          community.defaultSetting?.membershipEmail?.subject ?? defaultSubject
        ),
        cc: community.defaultSetting?.membershipEmail?.cc ?? [],
        message: mentionUtil.updateMentionInEditorState(
          community.defaultSetting?.membershipEmail?.message ?? defaultMessage
        ),
      },
    },
    hidden: {
      membershipYear,
      toItems,
      toEmail,
    },
  };
}

export function useHookForm(membershipYear: string) {
  const { community: communityFragment, property: propertyFragment } =
    useLayoutContext();
  const defaultValues = React.useMemo(() => {
    return defaultInputData(
      communityFragment,
      propertyFragment,
      membershipYear
    );
  }, [communityFragment, propertyFragment, membershipYear]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
