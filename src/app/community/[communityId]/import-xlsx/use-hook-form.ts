import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';

function schema() {
  return yup.object({
    id: yup.string().required(),
    method: yup.string().oneOf(Object.values(GQL.ImportMethod)).required(),
    hidden: yup
      .object({
        // To be mapped to xlsx argument later
        importList: yup
          .mixed<FileList>()
          .required()
          .test(
            'required',
            'Please upload a valid xlsx file',
            (files, context) => {
              // Only need to check this if import method requires a excel file
              // @ts-expect-error root should be parent's parent (root)
              const [, root] = context.from;
              const method: GQL.ImportMethod = root.value.method;
              if (method === GQL.ImportMethod.Xlsx) {
                return files.length > 0;
              }
              return true;
            }
          ),
      })
      .required(),
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
    method: GQL.ImportMethod.Random,
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
