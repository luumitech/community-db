import { useQuery } from '@apollo/client';
import { cn, Divider } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { toContactList } from './contact-util';
import { ContactView } from './contact-view';
import { ExportOptions } from './export-options';
import { FilterSelect } from './filter-select';
import {
  defaultInputData,
  type InputData,
} from './filter-select/use-hook-form';

const ExportContact_PropertyListQuery = graphql(/* GraphQL */ `
  query exportContactPropertyList($id: String!, $filter: PropertyFilterInput!) {
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
  const [filter, setFilter] = React.useState(
    defaultInputData({
      memberYear: null,
      nonMemberYear: null,
      memberEvent: null,
    })
  );
  const result = useQuery(ExportContact_PropertyListQuery, {
    variables: { id: communityId, filter },
    onError,
  });

  const contactInfo = React.useMemo(() => {
    const propertyList = result.data?.communityFromId.rawPropertyList;
    if (propertyList == null || result.loading) {
      return undefined;
    }
    return toContactList(propertyList);
  }, [result]);

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      result.refetch({ id: communityId, filter: input });
      setFilter(input);
    },
    [result, communityId]
  );

  const isLoading = result.loading || contactInfo == null;

  return (
    <div className={cn(className)}>
      <FilterSelect
        isDisabled={isLoading}
        filters={filter}
        onFilterChange={onFilterChange}
      />
      <ExportOptions contactInfo={contactInfo} />
      <Divider />
      <ContactView contactInfo={contactInfo} isLoading={isLoading} />
    </div>
  );
};
