import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { parseAsNumber } from '~/lib/number-util';
import { toast } from '~/view/base/toastify';
import { SuccessDialog } from './success-dialog';

const GenerateEmail_PropertyListQuery = graphql(/* GraphQL */ `
  query generateEmailPropertyList($id: String!, $filter: PropertyFilterInput!) {
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

/**
 * Generate email CSV using the filter settings
 *
 * - Suitable for importing into Mailchimp
 */
export function useGenerateEmail() {
  const { communityId, memberYear, nonMemberYear, event } =
    useFilterBarContext();
  const { searchText } = useSelector((state) => state.searchBar);
  const [emailListQuery] = useLazyQuery(GenerateEmail_PropertyListQuery);
  const [selectedMemberYear] = memberYear;
  const [selectedNonMemberYear] = nonMemberYear;
  const [selectedEvent] = event;

  const getPropertyList = React.useCallback(async () => {
    const result = await emailListQuery({
      variables: {
        id: communityId,
        filter: {
          searchText,
          memberYear: parseAsNumber(selectedMemberYear),
          nonMemberYear: parseAsNumber(selectedNonMemberYear),
          memberEvent: selectedEvent,
        },
      },
    });
    if (result.error) {
      throw result.error;
    }
    return result.data?.communityFromId.rawPropertyList ?? [];
  }, [
    emailListQuery,
    communityId,
    searchText,
    selectedMemberYear,
    selectedNonMemberYear,
    selectedEvent,
  ]);

  const generateEmailList = React.useCallback(() => {
    toast.promise(
      getPropertyList(),
      {
        pending: 'Generating Email list...',
        success: {
          autoClose: false,
          render: ({ data }) => <SuccessDialog propertyList={data} />,
        },
      },
      { toastId: 'generate-email' }
    );
  }, [getPropertyList]);

  return generateEmailList;
}
