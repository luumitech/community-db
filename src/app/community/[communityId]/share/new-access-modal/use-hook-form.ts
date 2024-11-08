import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zNonEmptyStr } from '~/lib/zod';
import type { AccessEntry } from '../_type';
import { UserInfoFragment } from '../user-info';

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
  return z
    .object({
      communityId: zNonEmptyStr(),
      email: z.string().email(),
      role: z.nativeEnum(GQL.Role),
      hidden: z.object({
        // Store accessList, so validator can use it to validate
        // email field
        accessList: z.array(z.unknown()),
      }),
    })
    .refine(
      (form) => {
        const accessList = form.hidden.accessList as AccessEntry[];
        const exist = accessList.find((fragment) => {
          const entry = getFragment(UserInfoFragment, fragment);
          return !entry.user.email.localeCompare(form.email, undefined, {
            sensitivity: 'accent',
          });
        });
        return !exist;
      },
      {
        message: 'Email already in access list',
        path: ['email'],
      }
    );
}

export type InputData = z.infer<ReturnType<typeof schema>>;
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
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(communityId, accessList));
  }, [reset, communityId, accessList]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
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
