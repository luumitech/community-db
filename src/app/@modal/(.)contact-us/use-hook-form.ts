import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    subject: zz.string.nonEmpty('Please enter a subject'),
    contactEmail: zz.string.nonEmpty().email('Must be a valid email'),
    contactName: z.string(),
    message: zz.string.nonEmpty('Please compose your message'),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(subject?: string | null): InputData {
  return {
    subject: subject ?? '',
    contactEmail: '',
    contactName: '',
    message: '',
  };
}

export function useHookForm(subject?: string | null) {
  const formMethods = useForm({
    defaultValues: defaultInputData(subject),
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export type UseHookFormResult = ReturnType<typeof useHookForm>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
