import { useQuery } from '@apollo/client';
import { cn, Divider } from '@heroui/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { toContactList } from './contact-util';
import { ContactView } from './contact-view';
import { ExportOptions } from './export-options';
import { FilterSelect } from './filter-select';
import {
  defaultInputData,
  type InputData,
} from './filter-select/use-hook-form';

const GenerateEmailList_PropertyListQuery = graphql(/* GraphQL */ `
  query generateEmailListPropertyList(
    $id: String!
    $filter: PropertyFilterInput!
  ) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
        id
        address
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
  const [filterArgs, setFilterArgs] = React.useState(
    defaultInputData({
      id: communityId,
      filter: {
        memberYear: null,
        nonMemberYear: null,
        memberEvent: null,
      },
    })
  );
  const result = useQuery(GenerateEmailList_PropertyListQuery, {
    variables: filterArgs,
  });
  useGraphqlErrorHandler(result);

  const contactInfo = React.useMemo(() => {
    const propertyList = result.data?.communityFromId.rawPropertyList;
    if (propertyList == null || result.loading) {
      return undefined;
    }
    return toContactList(propertyList);
  }, [result]);

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      result.refetch(input);
      setFilterArgs(input);
    },
    [result]
  );

  const isLoading = result.loading || contactInfo == null;

  return (
    <div className={cn(className)}>
      <FilterSelect
        isDisabled={isLoading}
        filterArgs={filterArgs}
        onFilterChange={onFilterChange}
      />
      <ExportOptions contactInfo={contactInfo} />
      <Divider />
      <ContactView contactInfo={contactInfo} isLoading={isLoading} />
    </div>
  );
};
