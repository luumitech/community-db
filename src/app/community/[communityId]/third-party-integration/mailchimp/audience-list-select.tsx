import { useQuery } from '@apollo/client';
import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { usePageContext } from '../page-context';

const ThirdPartyIntegration_MailchimpAudienceListQuery = graphql(/* GraphQL */ `
  query mailchimpAudienceList($input: MailchimpAudienceListInput!) {
    mailchimpAudienceList(input: $input) {
      name
      listId
    }
  }
`);

interface Props {
  className?: string;
}

export const AudienceListSelect: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();
  const result = useQuery(ThirdPartyIntegration_MailchimpAudienceListQuery, {
    variables: {
      input: {
        communityId: community.id,
      },
    },
  });
  useGraphqlErrorHandler(result);

  const audienceItems = React.useMemo(() => {
    const list = result.data?.mailchimpAudienceList ?? [];
    return list.map((audience) => ({
      key: audience.listId,
      label: audience.name,
    }));
  }, [result]);

  return (
    <Select
      className="max-w-xs"
      items={audienceItems}
      label="Audience List"
      placeholder="Select an audience list"
    >
      {(item) => <SelectItem>{item.label}</SelectItem>}
    </Select>
  );
};
