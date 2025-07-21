import { useQuery } from '@apollo/client';
import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';

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
  communityId: string;
  onSelect?: (listId: string) => void;
}

export const AudienceListSelect: React.FC<Props> = ({
  className,
  communityId,
  onSelect,
}) => {
  const result = useQuery(ThirdPartyIntegration_MailchimpAudienceListQuery, {
    variables: {
      input: { communityId },
    },
    fetchPolicy: 'cache-and-network', // Ensures we get the latest data
    onError,
  });

  const audienceItems = React.useMemo(() => {
    const list = result.data?.mailchimpAudienceList ?? [];
    return list.map((audience) => ({
      key: audience.listId,
      label: audience.name,
    }));
  }, [result]);

  return (
    <Select
      className={cn(className, 'max-w-xs')}
      items={audienceItems}
      label="Audience List"
      placeholder="Select an audience list"
      isDisabled={audienceItems.length === 0}
      onSelectionChange={(keys) => {
        const [listId] = keys;
        onSelect?.(listId as string);
      }}
    >
      {(item) => <SelectItem>{item.label}</SelectItem>}
    </Select>
  );
};
