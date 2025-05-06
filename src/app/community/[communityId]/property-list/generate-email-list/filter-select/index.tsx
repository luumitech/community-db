import { useLazyQuery } from '@apollo/client';
import { ModalBody, ModalFooter } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { usePanelContext } from '../panel-context';
import { InputData, useHookFormContext } from '../use-hook-form';
import { FilterSelectImpl } from './filter-select';

const GenerateEmailList_PropertyListQuery = graphql(/* GraphQL */ `
  query generateEmailListPropertyList(
    $id: String!
    $filter: PropertyFilterInput!
  ) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
        id
        occupantList {
          firstName
          lastName
          email
          optOut
        }
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const FilterSelect: React.FC<Props> = ({ className }) => {
  const [emailListQuery] = useLazyQuery(GenerateEmailList_PropertyListQuery);
  const { disclosure, goToPanel } = usePanelContext();
  const [pending, startTransition] = React.useTransition();
  const formMethods = useHookFormContext();
  const { handleSubmit } = formMethods;

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          const result = await emailListQuery({ variables: input });
          const propertyList =
            result.data?.communityFromId.rawPropertyList ?? [];
          goToPanel('email-list', { propertyList });
        } catch (err) {
          // error handled by parent
        }
      }),
    [emailListQuery, goToPanel]
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
        <FilterSelectImpl />
      </ModalBody>
      <ModalFooter>
        <Button
          variant="bordered"
          isDisabled={pending}
          onPress={() => disclosure.onClose()}
        >
          Close
        </Button>
        <Button type="submit" color="primary" isLoading={pending}>
          Generate
        </Button>
      </ModalFooter>
    </Form>
  );
};
