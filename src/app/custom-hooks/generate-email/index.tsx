import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
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
  const { communityId } = useAppContext();
  const { searchText, memberYear, nonMemberYear, event } = useSelector(
    (state) => state.searchBar
  );
  const [emailListQuery] = useLazyQuery(GenerateEmail_PropertyListQuery);

  const getPropertyList = React.useCallback(async () => {
    if (communityId == null) {
      throw new Error('Community ID is not set');
    }
    const result = await emailListQuery({
      variables: {
        id: communityId,
        filter: {
          searchText,
          memberYear: parseAsNumber(memberYear),
          nonMemberYear: parseAsNumber(nonMemberYear),
          memberEvent: event,
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
    memberYear,
    nonMemberYear,
    event,
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
