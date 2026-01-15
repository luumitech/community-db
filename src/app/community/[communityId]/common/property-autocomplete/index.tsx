import { useQuery } from '@apollo/client';
import { Autocomplete, AutocompleteItem, Spinner } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  Occupant,
  PropertyAddress,
} from '~/community/[communityId]/property-list/property-table';
import { actions, useDispatch } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { onError } from '~/graphql/on-error';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

const PropertyAutocompleteSearchQuery = graphql(/* GraphQL */ `
  query propertyAutocompleteSearch(
    $id: String!
    $first: Int! = 5
    $searchText: String
  ) {
    communityFromId(id: $id) {
      id
      propertyList(first: $first, filter: { searchText: $searchText }) {
        totalCount
        edges {
          node {
            id
            ...PropertyList_Address
            ...PropertyList_Occupant
          }
        }
      }
    }
  }
`);

type PropertyEntry =
  GQL.PropertyAutocompleteSearchQuery['communityFromId']['propertyList']['edges'][number]['node'];

/** Define a few special item keys used when displaying autoComplete menuItems, */
const ITEM_KEY_EMPTY = 'empty';
const ITEM_KEY_SHOWALL = 'showall';

interface Props {
  className?: string;
  currentPropertyId: string;
}

export const PropertyAutocomplete: React.FC<Props> = ({
  className,
  currentPropertyId,
}) => {
  const dispatch = useDispatch();
  const { communityId } = useLayoutContext();
  const [searchText, setSearchText] = React.useState('');

  const searchTextIsEmpty = !searchText || searchText.trim() === '';
  const { data, loading } = useQuery(PropertyAutocompleteSearchQuery, {
    variables: {
      id: communityId,
      first: 5,
      searchText,
    },
    context: {
      debounceKey: 'PropertyAutocompleteSearchQuery',
    },
    onError,
    skip: searchTextIsEmpty,
  });

  const setSearchBarText = React.useCallback(
    (input?: string) => {
      dispatch(actions.searchBar.setSearchText(input));
    },
    [dispatch]
  );

  const EmptyContent = React.useCallback(() => {
    if (loading) {
      return <Spinner size="sm" />;
    }

    return 'No properties found.';
  }, [loading]);

  const properties = React.useMemo(() => {
    const edges = data?.communityFromId.propertyList.edges ?? [];
    return edges.map(({ node }) => node);
  }, [data]);
  const totalCount = React.useMemo(() => {
    return data?.communityFromId.propertyList.totalCount ?? 0;
  }, [data]);

  const renderEmptyResults = React.useCallback(
    (itemList: PropertyEntry[]) => {
      if (searchTextIsEmpty) {
        return null;
      }

      if (itemList.length === 0) {
        return (
          <AutocompleteItem key={ITEM_KEY_EMPTY} textValue="empty">
            <EmptyContent />
          </AutocompleteItem>
        );
      }

      return null;
    },
    [searchTextIsEmpty, EmptyContent]
  );

  const renderSearchItems = React.useCallback(
    (itemList: PropertyEntry[]) => {
      return itemList.slice(0, 5).map((item) => {
        const propertyId = item.id;
        return (
          <AutocompleteItem
            classNames={{
              title: 'flex items-center gap-6',
            }}
            key={propertyId}
            textValue={item.id}
            href={appPath('property', { path: { communityId, propertyId } })}
            onPress={() => setSearchBarText('')}
          >
            <PropertyAddress fragment={item} />
            <Occupant fragment={item} />
          </AutocompleteItem>
        );
      });
    },
    [communityId, setSearchBarText]
  );

  const renderViewAllItems = React.useCallback(() => {
    if (totalCount <= 5) {
      return null;
    }
    return (
      <AutocompleteItem
        className="text-primary italic"
        key={ITEM_KEY_SHOWALL}
        textValue={ITEM_KEY_SHOWALL}
        href={appPath('propertyList', { path: { communityId } })}
        onPress={() => setSearchBarText(searchText)}
      >
        View all {totalCount} results
      </AutocompleteItem>
    );
  }, [totalCount, communityId, setSearchBarText, searchText]);

  return (
    <Autocomplete
      className={className}
      aria-label="Search Address or Member Name"
      placeholder="Search Address or Member Name"
      startContent={<Icon className="shrink-0" icon="search" />}
      items={properties}
      isLoading={loading}
      allowsCustomValue
      allowsEmptyCollection={!searchTextIsEmpty}
      listboxProps={{
        variant: 'flat',
        emptyContent: <EmptyContent />,
      }}
      /** Current property should not be selectable */
      disabledKeys={[ITEM_KEY_EMPTY, currentPropertyId]}
      selectorIcon={null}
      defaultInputValue={searchText}
      onInputChange={setSearchText}
    >
      <>
        {/**
         * When `allowsCustomValue` is specified (allowing arbitrary values to be
         * entered), the `allowsEmptyCollection` is not working correctly, so
         * `renderEmptyREsults` is introduced as replacement logic
         */}
        {renderEmptyResults(properties)}
        {renderSearchItems(properties)}
        {renderViewAllItems()}
      </>
    </Autocomplete>
  );
};
