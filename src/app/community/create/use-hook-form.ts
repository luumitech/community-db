import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';

export { useFieldArray } from 'react-hook-form';

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
  const schema = yup.object().shape({
    name: yup.string().required('Please provide a name'),
  });
  return yupResolver(schema);
}

export function useHookForm() {
  return useForm<InputData>({
    defaultValues: defaultInputData(),
    resolver: validationResolver(),
  });
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
