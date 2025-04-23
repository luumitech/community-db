import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    otp: zz.string.nonEmpty(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(): InputData {
  return {
    otp: '',
  };
}

export function useHookForm() {
  const defaultValues = React.useMemo(() => defaultInputData(), []);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
