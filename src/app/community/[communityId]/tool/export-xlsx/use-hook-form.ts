import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';

export interface InputData {
  ctxEmail: string;
  communityId: string;
}
type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    ctxEmail: '...', // To be filled in on server side
    communityId,
  };
}

export const schema = yup.object({
  ctxEmail: yup.string().required('You are not authorized'),
  communityId: yup.string().required(),
});

function validationResolver() {
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
