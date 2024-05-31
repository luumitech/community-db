import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';

function schema() {
  return yup.object({
    communityId: yup.string().required(),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    communityId,
  };
}

export function useHookForm(communityId: string) {
  const formMethods = useForm({
    defaultValues: defaultInputData(communityId),
    resolver: yupResolver(schema()),
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
