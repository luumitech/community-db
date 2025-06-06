import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    /** Community ID */
    id: zz.string.nonEmpty(),
    filter: z.object({
      memberYear: zz.coerce.toNumber({
        message: 'Must select a year',
        nullable: true,
      }),
      nonMemberYear: zz.coerce.toNumber({
        message: 'Must select a year',
        nullable: true,
      }),
      memberEvent: z.string().nullable(),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function defaultInputData(arg: InputData): InputData {
  return {
    id: arg.id,
    filter: {
      memberYear: arg.filter.memberYear ?? null,
      nonMemberYear: arg.filter.nonMemberYear ?? null,
      memberEvent: arg.filter.memberEvent ?? null,
    },
  };
}

export function useHookForm(arg: InputData) {
  const defaultValues = React.useMemo(() => defaultInputData(arg), [arg]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
