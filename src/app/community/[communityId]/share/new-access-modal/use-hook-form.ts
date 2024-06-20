import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { UserInfoFragment, type AccessEntry } from '../_type';

export const AccessCreateMutation = graphql(/* GraphQL */ `
  mutation accessCreate($input: AccessCreateInput!) {
    accessCreate(input: $input) {
      id
      ...AccessList_User
      ...AccessList_Role
      ...AccessList_Modify
      ...AccessList_Delete
    }
  }
`);

function schema() {
  return yup.object({
    communityId: yup.string().required(),
    email: yup
      .string()
      .email()
      .required()
      .test(
        'not-already-exist',
        'Email already in access list',
        (val, { parent }) => {
          const accessList: AccessEntry[] = parent.hidden.accessList;
          const exist = accessList.find((fragment) => {
            const entry = useFragment(UserInfoFragment, fragment);
            return entry.user.email === val;
          });
          return !exist;
        }
      ),
    role: yup.string().oneOf(Object.values(GQL.Role)).required(),
    hidden: yup.object({
      // Store accessList, so validator can use it to validate
      // email field
      accessList: yup.array(),
    }),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(
  communityId: string,
  accessList: AccessEntry[]
): DefaultData {
  return {
    communityId,
    email: '',
    role: GQL.Role.Viewer,
    hidden: { accessList },
  };
}

export function useHookFormWithDisclosure(
  communityId: string,
  accessList: AccessEntry[]
) {
  const formMethods = useForm({
    defaultValues: defaultInputData(communityId, accessList),
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(communityId, accessList));
  }, [reset, communityId, accessList]);

  /**
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(communityId, accessList));
  }, [reset, communityId, accessList]);
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
