import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useAppContext } from '~/custom-hooks/app-context';
import { graphql } from '~/graphql/generated';
import { parseAsNumber } from '~/lib/number-util';
import { toast } from '~/view/base/toastify';

const GenerateEmail_PropertyListQuery = graphql(/* GraphQL */ `
  query generateEmailPropertyList($id: String!, $filter: PropertyFilterInput!) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
        id
        occupantList {
          email
          optOut
        }
      }
    }
  }
`);

export function useGenerateEmail() {
  const { communityId, memberYear, nonMemberYear, event } =
    useFilterBarContext();
  const { communityUi } = useAppContext();
  const [emailListQuery] = useLazyQuery(GenerateEmail_PropertyListQuery);
  const [selectedMemberYear] = memberYear;
  const [selectedNonMemberYear] = nonMemberYear;
  const [selectedEvent] = event;

  const listGenerator = React.useCallback(async () => {
    const result = await emailListQuery({
      variables: {
        id: communityId,
        filter: {
          searchText: communityUi.propertyListSearch,
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
    communityUi.propertyListSearch,
    selectedMemberYear,
    selectedNonMemberYear,
    selectedEvent,
  ]);

  // Use local copyToClipboard implementation
  // until this is fixed:
  // https://github.com/uidotdev/usehooks/issues/312
  const copyToClipboard = React.useCallback(() => {
    const handleCopy = async () => {
      if (navigator?.clipboard?.writeText) {
        const propertyList = await listGenerator();
        const emailList = propertyList
          .flatMap(({ occupantList }) =>
            occupantList.map(({ email, optOut }) => (optOut ? null : email))
          )
          .filter((email): email is string => email != null);
        await navigator.clipboard.writeText(emailList.join(';'));
        return emailList.length;
      } else {
        throw new Error('writeText not supported');
      }
    };

    toast.promise(handleCopy(), {
      pending: 'Obtaining Email list...',
      success: {
        render: ({ data }) => `${data} emails copied`,
      },
    });
  }, [listGenerator]);

  return copyToClipboard;
}
