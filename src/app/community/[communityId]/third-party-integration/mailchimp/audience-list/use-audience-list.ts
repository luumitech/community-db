import { useQuery } from '@apollo/client';
import { type SortDescriptor } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { onError } from '~/graphql/on-error';
import { type RootState } from '~/lib/reducers';
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
          optOut
          infoList {
            type
            value
          }
        }
      }
    }
  }
`);

interface UseAudienceListOpt {
  communityId: string;
  listId?: string;
}

export function useAudienceList(arg: UseAudienceListOpt) {
  const dispatch = useDispatch();
  const mailchimp = useSelector((state) => state.mailchimp);
  const result = useQuery(ThirdPartyIntegration_MailchimpMemberListQuery, {
    variables: {
      input: { communityId: arg.communityId, listId: arg.listId! },
    },
    skip: arg.listId == null,
    // Required for refetch to update loading status
    notifyOnNetworkStatusChange: true,
    onError,
  });

  const doSort = React.useCallback(
    (desc: SortDescriptor) => {
      dispatch(actions.mailchimp.setSortDescriptor(desc));
    },
    [dispatch]
  );

  const rawAudienceList = React.useMemo(() => {
    return (result.data?.mailchimpMemberList ?? []).map((entry) => {
      const occupant = entry.property?.occupantList?.find(({ infoList }) =>
        infoList?.find((info) => {
          if (info.type === GQL.ContactInfoType.Email) {
            return !info.value.localeCompare(entry.email, undefined, {
              sensitivity: 'accent',
            });
          }
          return false;
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
    return sortAndFilterAudienceList(rawAudienceList, mailchimp);
  }, [rawAudienceList, mailchimp]);

  return {
    loading: result.loading,
    /** Refetch the audience list from mailchimp */
    refetch: result.refetch,
    audienceList,
    doSort,
    sortDescriptor: mailchimp.sortDescriptor,
  };
}

function sortAndFilterAudienceList(
  audienceList: AudienceMember[],
  mailchimp: RootState['mailchimp']
): AudienceMember[] {
  const { searchText, sortDescriptor, subscriberStatusList, optOut, warning } =
    mailchimp;
  const list = audienceList.filter((entry) => {
    const matchStatus = subscriberStatusList.includes(entry.status);

    let matchSearchText = true;
    if (searchText) {
      const toMatch = searchText.toLowerCase();
      matchSearchText =
        entry.email.toLowerCase().startsWith(toMatch) ||
        !!entry.fullName?.toLowerCase().includes(toMatch);
    }

    let matchOptOut = true;
    if (optOut != null) {
      matchOptOut = entry.occupant?.optOut === optOut;
    }

    let matchWarning = true;
    if (warning != null) {
      matchWarning = warning ? !!entry.warning : !entry.warning;
    }

    return matchSearchText && matchStatus && matchOptOut && matchWarning;
  });

  if (sortDescriptor != null) {
    const { column, direction } = sortDescriptor;
    switch (column) {
      case 'warning':
        list.sort((a, b) => {
          const aVal = a[column] ? 1 : 0;
          const bVal = b[column] ? 1 : 0;
          return direction === 'ascending' ? bVal - aVal : aVal - bVal;
        });
        break;

      case 'opt-out':
        list.sort((a, b) => {
          const aVal = a.occupant?.optOut ? 1 : 0;
          const bVal = b.occupant?.optOut ? 1 : 0;
          return direction === 'ascending' ? bVal - aVal : aVal - bVal;
        });
        break;

      case 'status':
      case 'fullName':
      case 'email':
        list.sort((a, b) => {
          const aVal = a[column] ?? '';
          const bVal = b[column] ?? '';
          const comp = aVal.localeCompare(bVal, undefined, {
            sensitivity: 'accent',
          });
          return direction === 'ascending' ? comp : -comp;
        });
        break;
    }
  }

  return list;
}
