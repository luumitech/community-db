'use client';
import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { InfoEditor } from './info-editor';
import { OccupantEditor } from './occupant-editor';
import { InputData, useHookForm } from './use-hook-form';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyId_Editor on Property {
    id
    address
    notes
    updatedAt
    updatedBy
    membershipList {
      year
      isMember
    }
    occupantList {
      firstName
      lastName
      optOut
      email
      cell
      work
      home
    }
  }
`);

interface Props {
  entry: FragmentType<typeof PropertyFragment>;
}

export const PropertyEditor: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);
  const formMethods = useHookForm(entry);
  const { formState } = formMethods;
  const onSubmit = (input: InputData) => {
    // console.log({ input });
  };

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <InfoEditor />
        <OccupantEditor />
        <Button
          className="my-2"
          color="primary"
          type="submit"
          isDisabled={!formMethods.formState.isDirty}
          // isLoading={result.loading}
        >
          Save
        </Button>
      </FormProvider>
    </form>
  );
};
