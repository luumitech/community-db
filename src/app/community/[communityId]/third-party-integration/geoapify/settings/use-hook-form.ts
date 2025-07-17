import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

export const ModifyFragment = graphql(/* GraphQL */ `
  fragment ThirdPartyIntegration_Geoapify_Settings on Community {
    id
    geoapifySetting {
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
    geoapifySetting: z.object({
      apiKey: z
        .string()
        .min(9, 'Must be a valid Geoapify API key')
        .or(z.literal(''))
        .nullable(),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.ThirdPartyIntegration_Geoapify_SettingsFragment
): InputData {
  return {
    geoapifySetting: {
      apiKey: item.geoapifySetting?.apiKey ?? null,
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
