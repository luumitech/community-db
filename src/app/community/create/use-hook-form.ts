import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';

export interface InputData {
  name: string;
}

type DefaultData = DefaultInput<InputData>;

function defaultInputData(): DefaultData {
  return {
    name: '',
  };
}

function validationResolver() {
  const schema = yup.object({
    name: yup.string().required('Please provide a name'),
  });
  return yupResolver(schema);
}

export function useHookForm() {
  return useForm({
    defaultValues: defaultInputData(),
    resolver: validationResolver(),
  });
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
