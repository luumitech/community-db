import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    communityId: zz.string.nonEmpty(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(communityId: string): InputData {
  return {
    communityId,
  };
}

export function useHookForm(communityId: string) {
  const formMethods = useForm({
    defaultValues: defaultInputData(communityId),
    resolver: zodResolver(schema()),
  });

  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new defaults
    reset(defaultInputData(communityId));
  }, [reset, communityId]);

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
