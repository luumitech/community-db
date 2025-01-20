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
  const defaultValues = React.useMemo(
    () => defaultInputData(communityId),
    [communityId]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new defaults
    reset(defaultValues);
  }, [reset, defaultValues]);

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
