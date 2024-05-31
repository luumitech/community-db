import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/react';
import React from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { FormProvider } from '~/custom-hooks/hook-form';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { ModalDialog } from './modal-dialog';
import { InputData, useHookFormWithDisclosure } from './use-hook-form';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipEditor on Property {
    id
    updatedAt
    notes
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        eventDate
      }
      paymentMethod
      paymentDeposited
    }
  }
`);

const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_MembershipEditor
    }
  }
`);

interface Props {
  className?: string;
  entry: FragmentType<typeof EntryFragment>;
}

export const MembershipEditor: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const [updateProperty, result] = useMutation(PropertyMutation);
  useGraphqlErrorHandler(result);
  const { formMethods, disclosure } = useHookFormWithDisclosure(entry);
  const { formState } = formMethods;
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
          Edit Membership
        </Button>
        <ModalDialog
          entry={entry}
          disclosureProps={disclosure}
          onSave={onSave}
          isSaving={result.loading}
        />
      </FormProvider>
    </div>
  );
};
