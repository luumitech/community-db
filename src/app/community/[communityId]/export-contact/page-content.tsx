import { useQuery } from '@apollo/client';
import { cn, Divider } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { ContactSummary } from './contact-summary';
import { ContactTable } from './contact-table';
import { toContactList } from './contact-util';
import { ExportOptions } from './export-options';
import { FilterSelect } from './filter-select';
import { type InputData } from './filter-select/use-hook-form';

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
          optOut
          infoList {
            type
            value
            label
          }
        }
      }
    }
  }
`);

interface Props {
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ communityId }) => {
  const searchBar = useSelector((state) => state.searchBar);
  const [filter, setFilter] = React.useState(searchBar.filter);
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

  const isLoading = result.loading || contactInfo == null;
  const contactList = contactInfo?.contactList ?? [];

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      result.refetch({ id: communityId, filter: input });
      setFilter(input);
    },
    [result, communityId]
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="mb-2 flex flex-col gap-2">
        <ExportOptions contactInfo={contactInfo} />
        <Divider />
        <FilterSelect
          isDisabled={isLoading}
          filters={filter}
          onFilterChange={onFilterChange}
        />
        <ContactSummary contactInfo={contactInfo} isLoading={isLoading} />
      </div>
    );
  }, [contactInfo, filter, isLoading, onFilterChange]);

  return (
    <ContactTable
      items={contactList}
      isLoading={isLoading}
      topContent={topContent}
    />
  );
};
