import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { z, zz } from '~/lib/zod';

export const CommunityCreateMutation = graphql(/* GraphQL */ `
  mutation communityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      id
      name
    }
  }
`);

function schema() {
  return z.object({
    name: zz.string.nonEmpty('Please provide a name'),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(): InputData {
  return {
    name: '',
  };
}

export function useHookForm() {
  const formMethods = useForm({
    defaultValues: defaultInputData(),
    resolver: zodResolver(schema()),
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
