import { useQuery } from '@apollo/client';
import { cn, Divider } from '@heroui/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { ExportOptions } from './export-options';
import { FilterSelect } from './filter-select';
import { useHookForm, type InputData } from './use-hook-form';

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
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ className, communityId }) => {
  const { formMethods, defaultValues } = useHookForm(communityId);
  const { watch, handleSubmit } = formMethods;
  const result = useQuery(GenerateEmailList_PropertyListQuery, {
    variables: defaultValues,
  });
  useGraphqlErrorHandler(result);

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await result.refetch(input);
    },
    [result.refetch]
  );

  React.useEffect(() => {
    const subscription = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch, onSubmit]);

  const propertyList = React.useMemo(() => {
    return result.data?.communityFromId.rawPropertyList;
  }, [result]);

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          'grid gap-4',
          'grid-cols-1 sm:grid-cols-[max-content_1fr]'
        )}
      >
        <FormProvider {...formMethods}>
          <FilterSelect />
        </FormProvider>
        <Divider className="sm:hidden" />
        <ExportOptions
          propertyList={propertyList ?? []}
          isLoading={propertyList == null && result.loading}
        />
      </div>
    </div>
  );
};
