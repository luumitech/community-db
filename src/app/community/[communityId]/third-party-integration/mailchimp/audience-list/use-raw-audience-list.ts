import { useQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { onError } from '~/graphql/on-error';
import type { AudienceListArg, Occupant, Property } from './_type';

const ThirdPartyIntegration_MailchimpMemberListQuery = graphql(/* GraphQL */ `
  query thirdPartyIntegrationMailchimpMemberList(
    $input: MailchimpMemberListInput!
  ) {
    mailchimpMemberList(input: $input) {
      id
      email_address
      full_name
      status
    }
  }
`);

const ThirdPartyIntegration_EmailPropertyListQuery = graphql(/* GraphQL */ `
  query thirdPartyIntegrationEmailPropertyList(
    $id: String!
    $filter: PropertyFilterInput!
  ) {
    communityFromId(id: $id) {
      id
      rawPropertyList(filter: $filter) {
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

export function useRawAudienceList(arg: AudienceListArg) {
  const memberListResult = useQuery(
    ThirdPartyIntegration_MailchimpMemberListQuery,
    {
      variables: {
        input: { communityId: arg.communityId, listId: arg.listId! },
      },
      skip: arg.listId == null,
      // Required for refetch to update loading status
      notifyOnNetworkStatusChange: true,
      onError,
    }
  );
  const mailchimpMemberList = React.useMemo(
    () => memberListResult.data?.mailchimpMemberList,
    [memberListResult]
  );
  const emailList = React.useMemo(() => {
    return mailchimpMemberList?.map(({ email_address }) => email_address);
  }, [mailchimpMemberList]);

  const propertyListResult = useQuery(
    ThirdPartyIntegration_EmailPropertyListQuery,
    {
      variables: {
        id: arg.communityId,
        filter: { emailList },
      },
      skip: emailList == null,
      // Required for refetch to update loading status
      notifyOnNetworkStatusChange: true,
      onError,
    }
  );

  /**
   * For each email found in the property list, create a map, so it would be
   * easy to find the associated property and occupant information given the
   * email
   */
  const emailMap = React.useMemo(() => {
    if (propertyListResult.data == null) {
      return;
    }
    const resultMap = new Map<string, [Property, Occupant]>();
    propertyListResult.data.communityFromId.rawPropertyList.forEach(
      (property) => {
        property.occupantList?.forEach((occupant) => {
          occupant.infoList?.forEach(({ type, value }) => {
            if (type === GQL.ContactInfoType.Email) {
              const email = value.toLocaleLowerCase();
              resultMap.set(email, [property, occupant]);
            }
          });
        });
      }
    );
    return resultMap;
  }, [propertyListResult]);

  return {
    loading: memberListResult.loading || propertyListResult.loading,
    /** Refetch the audience list from mailchimp */
    refetch: memberListResult.refetch,
    mailchimpMemberList,
    emailMap,
  };
}
