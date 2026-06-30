import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/types';
import { z, zz } from '~/lib/zod';

function schema() {
  return z
    .object({
      communityId: zz.string.nonEmpty(),
      email: z.string().email(),
      role: z.nativeEnum(GQL.Role),
      hidden: z.object({
        /**
         * Store email list for all users with access, so validator can use it
         * to validate email field
         */
        accessEmailList: z.array(z.string()),
      }),
    })
    .refine(
      (form) => {
        const accessEmailList = form.hidden.accessEmailList;
        const exist = accessEmailList.find((email) => {
          return !email.localeCompare(form.email, undefined, {
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
  accessEmailList: string[]
): InputData {
  return {
    communityId,
    email: '',
    role: GQL.Role.Viewer,
    hidden: { accessEmailList },
  };
}

export function useHookForm(communityId: string, accessEmailList: string[]) {
  const defaultValues = React.useMemo(
    () => defaultInputData(communityId, accessEmailList),
    [communityId, accessEmailList]
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
