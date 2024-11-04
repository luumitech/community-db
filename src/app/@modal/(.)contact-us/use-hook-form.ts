import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';

function schema() {
  return yup.object({
    subject: yup.string().required(),
    contactEmail: yup
      .string()
      .email('Must be a valid email')
      .required('Please enter a valid email'),
    contactName: yup.string(),
    message: yup.string().required('Please compose your message'),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
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
    resolver: yupResolver(schema()),
  });

  return { formMethods };
}

export type UseHookFormResult = ReturnType<typeof useHookForm>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
