import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/graphql';
import { type RootState } from '~/lib/reducers';
import { type AudienceListArg, type AudienceMember } from './_type';
import { type SortDescriptor } from './audience-table';
import { useRawAudienceList } from './use-raw-audience-list';

export function useAudienceList(arg: AudienceListArg) {
  const dispatch = useDispatch();
  const mailchimp = useSelector((state) => state.mailchimp);
  const { loading, refetch, mailchimpMemberList, emailMap } =
    useRawAudienceList(arg);

  const doSort = React.useCallback(
    (desc: SortDescriptor | null) => {
      dispatch(actions.mailchimp.setSortDescriptor(desc));
    },
    [dispatch]
  );

  const rawAudienceList = React.useMemo<AudienceMember[]>(() => {
    if (mailchimpMemberList == null || emailMap == null) {
      return [];
    }
    return mailchimpMemberList.map((entry, idx) => {
      const [property, occupant] =
        emailMap.get(entry.email_address.toLocaleLowerCase()) ?? [];

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
        property,
        occupant,
        warning,
      };
    });
  }, [mailchimpMemberList, emailMap]);

  /** Filter rawAudienceList based on filters and sort schemes */
  const audienceList = React.useMemo(() => {
    return sortAndFilterAudienceList(rawAudienceList, mailchimp);
  }, [rawAudienceList, mailchimp]);

  return {
    loading,
    refetch,
    audienceList,
    doSort,
    sortDescriptor: mailchimp.sortDescriptor,
  };
}

function sortAndFilterAudienceList(
  audienceList: AudienceMember[],
  mailchimp: RootState['mailchimp']
): AudienceMember[] {
  const { searchText, sortDescriptor, filter } = mailchimp;
  const { subscriberStatusList, optOut, warning } = filter;

  const list = audienceList.filter((entry) => {
    let matchStatus = true;
    if (subscriberStatusList.length > 0) {
      matchStatus = subscriberStatusList.includes(entry.status);
    }

    let matchSearchText = true;
    if (searchText) {
      const toMatch = searchText.toLowerCase();
      matchSearchText =
        !!entry.email_address.toLowerCase().startsWith(toMatch) ||
        !!entry.full_name?.toLowerCase().includes(toMatch);
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
    const { columnKey, direction } = sortDescriptor;
    switch (columnKey) {
      case 'warning':
        list.sort((a, b) => {
          const aVal = a[columnKey] ? 1 : 0;
          const bVal = b[columnKey] ? 1 : 0;
          return direction === 'ascending' ? bVal - aVal : aVal - bVal;
        });
        break;

      case 'optOut':
        list.sort((a, b) => {
          const aVal = a.occupant?.optOut ? 1 : 0;
          const bVal = b.occupant?.optOut ? 1 : 0;
          return direction === 'ascending' ? bVal - aVal : aVal - bVal;
        });
        break;

      case 'status':
      case 'full_name':
      case 'email_address':
        list.sort((a, b) => {
          const aVal = a[columnKey] ?? '';
          const bVal = b[columnKey] ?? '';
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
