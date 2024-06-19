import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';

export const CommunityCreateMutation = graphql(/* GraphQL */ `
  mutation communityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      id
      name
    }
  }
`);

function schema() {
  return yup.object({
    name: yup.string().required('Please provide a name'),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(): DefaultData {
  return {
    name: '',
  };
}

export function useHookForm() {
  const formMethods = useForm({
    defaultValues: defaultInputData(),
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with
    // new default from fragment
    reset(defaultInputData());
  }, [reset]);

  return formMethods;
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
