import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { type AccessEntry } from '../_type';

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

export const AccessModifyMutation = graphql(/* GraphQL */ `
  mutation accessModify($input: AccessModifyInput!) {
    accessModify(input: $input) {
      ...AccessList_Modify
    }
  }
`);

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

function defaultInputData(fragment: AccessEntry): InputData {
  const access = getFragment(ModifyFragment, fragment);
  return {
    self: {
      id: access.id,
      updatedAt: access.updatedAt,
    },
    role: access.role,
  };
}

export function useHookFormWithDisclosure(fragment: AccessEntry) {
  const formMethods = useForm({
    defaultValues: defaultInputData(fragment),
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(fragment));
  }, [reset, fragment]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods, fragment };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
