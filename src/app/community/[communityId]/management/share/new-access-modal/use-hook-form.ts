import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';

const EntryFragment = graphql(/* GraphQL */ `
  fragment Share_NewAccessModal on Access {
    id
    community {
      id
    }
    user {
      email
    }
    role
  }
`);

export const AccessCreateMutation = graphql(/* GraphQL */ `
  mutation accessCreate($input: AccessCreateInput!) {
    accessCreate(input: $input) {
      ...Share_NewAccessModal
    }
  }
`);

function schema() {
  return yup.object({
    communityId: yup.string().required(),
    email: yup.string().email().required(),
    role: yup.string().oneOf(Object.values(GQL.Role)).required(),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    communityId,
    email: '',
    role: GQL.Role.Viewer,
  };
}

export function useHookFormWithDisclosure(communityId: string) {
  const formMethods = useForm({
    defaultValues: defaultInputData(communityId),
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(communityId));
  }, [reset, communityId]);

  /**
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(communityId));
  }, [reset, communityId]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
