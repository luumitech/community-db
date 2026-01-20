import { useQuery } from '@apollo/client';
import { cn, Divider } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import {
  GridTable,
  type GridTableProps as GenericGTProps,
} from '~/view/base/grid-table';
import type { ContactListEntry } from './_type';
import { ContactSummary } from './contact-summary';
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

/**
 * Defines column keys used for rendering table,
 *
 * - Put in generic type for GridTableProps
 * - Make all field required, so it's easier to define callback functions
 */
const COLUMN_KEYS = ['firstName', 'lastName', 'email', 'address'] as const;
type GridTableProps = GenericGTProps<typeof COLUMN_KEYS, ContactListEntry>;
type GTProps = Required<GridTableProps>;

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

  const renderHeader: GTProps['renderHeader'] = React.useCallback((key) => {
    switch (key) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'email':
        return 'Email';
      case 'address':
        return 'Address';
    }
  }, []);

  const renderItem: GTProps['renderItem'] = React.useCallback((key, item) => {
    return <span>{item[key]}</span>;
  }, []);

  return (
    <GridTable
      aria-label="Contact Table"
      isHeaderSticky
      config={{
        gridContainer: cn(
          // Collapsed grid layout
          'grid-cols-2',
          // Normal grid layout
          'sm:grid-cols-[repeat(4,auto)]'
        ),
        headerContainer: cn('p-2'),
        bodyContainer: cn('p-2 text-sm'),
      }}
      columnKeys={COLUMN_KEYS}
      columnConfig={{
        email: cn('col-span-2 sm:col-span-1'),
        address: cn('col-span-2 sm:col-span-1'),
      }}
      renderHeader={renderHeader}
      items={contactList}
      renderItem={renderItem}
      isLoading={isLoading}
      topContent={topContent}
    />
  );
};
