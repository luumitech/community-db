import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';

function schema() {
  return yup.object({
    id: yup.string().required(),
    hidden: yup.object({
      // To be mapped to xlsx argument later
      importList: yup
        .mixed<FileList>()
        .required()
        .test('required', 'Please upload a valid xlsx file', (files) => {
          return files.length > 0;
        }),
    }),
  });
}

export const CommunityImportMutation = graphql(/* GraphQL */ `
  mutation communityImport($input: CommunityImportInput!) {
    communityImport(input: $input) {
      id
    }
  }
`);

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    id: communityId,
    hidden: {
      importList: [] as unknown as FileList,
    },
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
