import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

export const ModifyFragment = graphql(/* GraphQL */ `
  fragment AccessList_Modify on Access {
    id
    updatedAt
    user {
      email
    }
    role
  }
`);
export type ModifyFragmentType = FragmentType<typeof ModifyFragment>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    role: z.nativeEnum(GQL.Role),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(access: GQL.AccessList_ModifyFragment): InputData {
  return {
    self: {
      id: access.id,
      updatedAt: access.updatedAt,
    },
    role: access.role,
  };
}

export function useHookForm(fragment: ModifyFragmentType) {
  const access = getFragment(ModifyFragment, fragment);
  const defaultValues = React.useMemo(() => defaultInputData(access), [access]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, access };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
