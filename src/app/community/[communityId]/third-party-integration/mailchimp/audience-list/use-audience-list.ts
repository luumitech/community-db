import { useQuery } from '@apollo/client';
import { type SortDescriptor } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { onError } from '~/graphql/on-error';
import { type AudienceMember } from './_type';

const ThirdPartyIntegration_MailchimpMemberListQuery = graphql(/* GraphQL */ `
  query thirdPartyIntegrationMailchimpMemberList(
    $input: MailchimpMemberListInput!
  ) {
    mailchimpMemberList(input: $input) {
      email
      fullName
      status
      property {
        id
        address
        occupantList {
          email
          optOut
        }
      }
    }
  }
`);

interface UseAudienceListOpt {
  communityId: string;
  listId?: string;
  statusFilter: GQL.MailchimpSubscriberStatus[] | 'all';
}

export function useAudienceList(arg: UseAudienceListOpt) {
  const result = useQuery(ThirdPartyIntegration_MailchimpMemberListQuery, {
    variables: {
      input: { communityId: arg.communityId, listId: arg.listId! },
    },
    skip: arg.listId == null,
    onError,
  });
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const rawAudienceList = React.useMemo(() => {
    return (result.data?.mailchimpMemberList ?? []).map((entry) => {
      const occupant = entry.property?.occupantList?.find(
        ({ email }) =>
          !email?.localeCompare(entry.email, undefined, {
            sensitivity: 'accent',
          })
      );
      let warning: string | undefined;
      if (occupant != null) {
        if (
          occupant.optOut &&
          entry.status === GQL.MailchimpSubscriberStatus.Subscribed
        ) {
          warning =
            'This email is marked as subscribed in Mailchimp, but marked as Opt-Out in the database';
        } else if (
          !occupant.optOut &&
          entry.status === GQL.MailchimpSubscriberStatus.Unsubscribed
        ) {
          warning =
            'This email is marked as unsubscribed in Mailchimp, but not marked as Opt-Out in the database';
        } else if (entry.status === GQL.MailchimpSubscriberStatus.Cleaned) {
          warning =
            'This email is marked as cleaned in Mailchimp, but it is still exists in the database, perhaps it should be removed from database';
        } else if (entry.status === GQL.MailchimpSubscriberStatus.Archive) {
          warning =
            'This email is marked as archived in Mailchimp, but it is still exists in the database, perhaps it should be removed from database';
        }
      } else {
        if (entry.status === GQL.MailchimpSubscriberStatus.Subscribed) {
          warning =
            'This email is marked as subscribed in Mailchimp, but it does not exist in the database.';
        }
      }
      return {
        ...entry,
        occupant,
        warning,
      };
    });
  }, [result]);

  /** Filter rawAudienceList based on filters and sort schemes */
  const audienceList = React.useMemo(() => {
    return sortAndFilterAudienceList(
      rawAudienceList,
      arg.statusFilter,
      sortDescriptor
    );
  }, [rawAudienceList, arg, sortDescriptor]);

  return {
    loading: result.loading,
    /** Refetch the audience list from mailchimp */
    refetch: result.refetch,
    audienceList,
    doSort: setSortDescriptor,
    sortDescriptor,
  };
}

function sortAndFilterAudienceList(
  audienceList: AudienceMember[],
  statusFilter: GQL.MailchimpSubscriberStatus[] | 'all',
  sortDescriptor?: SortDescriptor
): AudienceMember[] {
  const list = audienceList.filter((entry) => {
    const showStatus =
      statusFilter === 'all' || statusFilter.includes(entry.status);
    return showStatus;
  });

  if (sortDescriptor != null) {
    const { column, direction } = sortDescriptor;
    if (column === 'warning') {
      list.sort((a, b) => {
        const aVal = a.warning ? 1 : 0;
        const bVal = b.warning ? 1 : 0;
        return direction === 'ascending' ? bVal - aVal : aVal - bVal;
      });
    }
  }

  return list;
}
