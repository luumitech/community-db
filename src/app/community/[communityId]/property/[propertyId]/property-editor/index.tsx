import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { InfoEditor } from './info-editor';
import { InputData, useHookForm } from './use-hook-form';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyEditor on Property {
    id
    updatedAt
    notes
  }
`);

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_PropertyEditor
    }
  }
`);

interface Props {
  entry: FragmentType<typeof PropertyFragment>;
}

export const PropertyEditor: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);
  const [updateProperty, result] = useMutation(PropertyMutation);
  useGraphqlErrorHandler(result);
  const formMethods = useHookForm(entry);
  const { formState } = formMethods;
  const onSubmit = async (input: InputData) => {
    if (!formState.isDirty) {
      return;
    }
    await updateProperty({
      variables: {
        input: {
          self: { id: entry.id, updatedAt: entry.updatedAt },
          ...input,
        },
      },
    });
  };

  return (
    <form onBlur={formMethods.handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <InfoEditor />
      </FormProvider>
    </form>
  );
};
