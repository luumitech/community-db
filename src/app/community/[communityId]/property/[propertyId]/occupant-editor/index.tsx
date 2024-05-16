import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { BiEditAlt } from 'react-icons/bi';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { ModalDialog } from './modal-dialog';
import { InputData, useHookFormWithDisclosure } from './use-hook-form';

const PropertyFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantEditor on Property {
    id
    updatedAt
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

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_OccupantEditor
    }
  }
`);

interface Props {
  className?: string;
  entry: FragmentType<typeof PropertyFragment>;
}

export const OccupantEditor: React.FC<Props> = (props) => {
  const entry = useFragment(PropertyFragment, props.entry);
  const { formMethods, disclosure } = useHookFormWithDisclosure(entry);
  const { formState } = formMethods;
  const [updateProperty, result] = useMutation(OccupantMutation);
  useGraphqlErrorHandler(result);

  const onSave = async (input: InputData) => {
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
    <div className={props.className}>
      <FormProvider {...formMethods}>
        <Button
          size="sm"
          endContent={<BiEditAlt />}
          {...disclosure.getButtonProps()}
        >
          Edit Member Details
        </Button>
        <ModalDialog
          disclosureProps={disclosure}
          onSave={onSave}
          isSaving={result.loading}
        />
      </FormProvider>
    </div>
  );
};
