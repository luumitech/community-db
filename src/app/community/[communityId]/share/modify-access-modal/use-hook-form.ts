import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
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
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    role: yup.string().oneOf(Object.values(GQL.Role)).required(),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(fragment: AccessEntry): DefaultData {
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
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(fragment));
  }, [reset, fragment]);

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
