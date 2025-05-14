import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

const ModifyFragment = graphql(/* GraphQL */ `
  fragment ThirdPartyIntegration_Mailchimp_Settings on Community {
    id
    mailchimpSetting {
      apiKey
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
    mailchimpSetting: z.object({
      apiKey: z
        .string()
        .min(9, 'Must be a valid Mailchimp API key')
        .or(z.literal(''))
        .nullable(),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.ThirdPartyIntegration_Mailchimp_SettingsFragment
): InputData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    mailchimpSetting: {
      apiKey: item.mailchimpSetting?.apiKey ?? null,
    },
  };
}

export function useHookForm(fragment: ModifyFragmentType) {
  const community = getFragment(ModifyFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community),
    [community]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, community };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
