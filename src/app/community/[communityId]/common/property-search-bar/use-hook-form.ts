import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    memberYear: zz.coerce.toNumber({ nullable: true }),
    nonMemberYear: zz.coerce.toNumber({ nullable: true }),
    event: z.string().nullable(),
    withGps: zz.coerce.toBoolean({ nullable: true }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function defaultInputData(
  memberYear: number | null,
  nonMemberYear: number | null,
  event: string | null,
  withGps: boolean | null
): InputData {
  return {
    memberYear: memberYear ?? null,
    nonMemberYear: nonMemberYear ?? null,
    event: event ?? null,
    withGps: withGps ?? null,
  };
}

export function useHookForm(
  memberYear: number | null,
  nonMemberYear: number | null,
  event: string | null,
  withGps: boolean | null
) {
  const defaultValues = React.useMemo(() => {
    return defaultInputData(memberYear, nonMemberYear, event, withGps);
  }, [memberYear, nonMemberYear, event, withGps]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
