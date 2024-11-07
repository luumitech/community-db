import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zNonEmptyStr } from '~/lib/zod';

function schema() {
  return z.object({
    subject: zNonEmptyStr({ message: 'Please enter a subject' }),
    contactEmail: z.string().email('Must be a valid email'),
    contactName: z.string().optional(),
    message: zNonEmptyStr({ message: 'Please compose your message' }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
type DefaultData = DefaultInput<InputData>;

function defaultInputData(subject?: string | null): DefaultData {
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
