import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import type { AccessEntry } from '../_type';
import { UserInfoFragment } from '../user-info';

function schema() {
  return z
    .object({
      communityId: zz.string.nonEmpty(),
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

function defaultInputData(
  communityId: string,
  accessList: AccessEntry[]
): InputData {
  return {
    communityId,
    email: '',
    role: GQL.Role.Viewer,
    hidden: { accessList },
  };
}

export function useHookForm(communityId: string, accessList: AccessEntry[]) {
  const defaultValues = React.useMemo(
    () => defaultInputData(communityId, accessList),
    [communityId, accessList]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
