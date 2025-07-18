import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    memberYear: zz.coerce.toNumber({ nullable: true }),
    nonMemberYear: zz.coerce.toNumber({ nullable: true }),
    memberEvent: z.string().nullable(),
    withGps: zz.coerce.toBoolean({ nullable: true }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultFilterInputData(
  memberYear: number | null,
  nonMemberYear: number | null,
  memberEvent: string | null,
  withGps: boolean | null
): InputData {
  return {
    memberYear: memberYear ?? null,
    nonMemberYear: nonMemberYear ?? null,
    memberEvent: memberEvent ?? null,
    withGps: withGps ?? null,
  };
}

export function useHookForm(
  memberYear: number | null,
  nonMemberYear: number | null,
  memberEvent: string | null,
  withGps: boolean | null
) {
  const defaultValues = React.useMemo(() => {
    return defaultFilterInputData(
      memberYear,
      nonMemberYear,
      memberEvent,
      withGps
    );
  }, [memberYear, nonMemberYear, memberEvent, withGps]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
