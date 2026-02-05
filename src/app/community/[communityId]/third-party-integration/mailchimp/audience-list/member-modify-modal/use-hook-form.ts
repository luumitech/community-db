import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { usePageContext } from '~/community/[communityId]/third-party-integration/page-context';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

export const ModifyFragment = graphql(/* GraphQL */ `
  fragment MailchimpMember_Modify on MailchimpMember {
    id
    email_address
    full_name
    merge_fields {
      FNAME
      LNAME
    }
    status
  }
`);
export type ModifyFragmentType = FragmentType<typeof ModifyFragment>;

function schema() {
  return z.object({
    self: z.object({
      communityId: zz.string.nonEmpty(),
      listId: zz.string.nonEmpty(),
      memberId: zz.string.nonEmpty(),
    }),
    email_address: zz.string.nonEmpty(),
    merge_fields: z.object({
      FNAME: z.string(),
      LNAME: z.string(),
    }),
    status: z.nativeEnum(GQL.MailchimpSubscriberStatus),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  communityId: string,
  audienceListId: string,
  member: GQL.MailchimpMember_ModifyFragment
): InputData {
  return {
    self: {
      communityId,
      listId: audienceListId,
      memberId: member.id,
    },
    email_address: member.email_address,
    merge_fields: {
      FNAME: member.merge_fields.FNAME,
      LNAME: member.merge_fields.LNAME,
    },
    status: member.status,
  };
}

export function useHookForm(
  audienceListId: string,
  fragment: ModifyFragmentType
) {
  const { community } = usePageContext();
  const member = getFragment(ModifyFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community.id, audienceListId, member),
    [community, audienceListId, member]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, member };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
