import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';

export interface InputData {
  communityId: string;
}
type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    communityId,
  };
}

function validationResolver() {
  const schema = yup.object({
    communityId: yup.string().required(),
  });
  return yupResolver(schema);
}

export function useHookForm(communityId: string) {
  const defaultValues = defaultInputData(communityId);
  const formMethods = useForm({
    defaultValues,
    resolver: validationResolver(),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
