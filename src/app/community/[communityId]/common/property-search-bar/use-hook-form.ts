import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z } from '~/lib/zod';

function schema() {
  return z.object({
    memberYear: z.string(),
    nonMemberYear: z.string(),
    event: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  memberYear?: string,
  nonMemberYear?: string,
  event?: string
): InputData {
  return {
    memberYear: memberYear ?? '',
    nonMemberYear: nonMemberYear ?? '',
    event: event ?? '',
  };
}

export function useHookForm(
  memberYear?: string,
  nonMemberYear?: string,
  event?: string
) {
  const defaultValues = React.useMemo(() => {
    return defaultInputData(memberYear, nonMemberYear, event);
  }, [memberYear, nonMemberYear, event]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
