import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    memberYear: zz.coerce.toNumber({ nullable: true }),
    nonMemberYear: zz.coerce.toNumber({ nullable: true }),
    memberEvent: z.string().nullable(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function defaultInputData(arg: InputData): InputData {
  return {
    memberYear: arg.memberYear ?? null,
    nonMemberYear: arg.nonMemberYear ?? null,
    memberEvent: arg.memberEvent ?? null,
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
