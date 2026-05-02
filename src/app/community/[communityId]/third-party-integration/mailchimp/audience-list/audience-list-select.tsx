import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import {
  PlainSelect,
  type PlainSelectProps,
  type SelectItem,
} from '~/view/base/select';

const ThirdPartyIntegration_MailchimpAudienceListQuery = graphql(/* GraphQL */ `
  query mailchimpAudienceList($input: MailchimpAudienceListInput!) {
    mailchimpAudienceList(input: $input) {
      name
      listId
    }
  }
`);

type CustomProps = Omit<PlainSelectProps, 'items'>;

interface Props extends CustomProps {
  className?: string;
  communityId: string;
}

export const AudienceListSelect: React.FC<Props> = ({
  className,
  communityId,
  onSelect,
  ...props
}) => {
  const result = useQuery(ThirdPartyIntegration_MailchimpAudienceListQuery, {
    variables: {
      input: { communityId },
    },
    fetchPolicy: 'cache-and-network', // Ensures we get the latest data
    onError,
  });

  const audienceItems = React.useMemo<SelectItem[]>(() => {
    const list = result.data?.mailchimpAudienceList ?? [];
    return list.map((audience) => ({
      key: audience.listId,
      textValue: audience.name,
    }));
  }, [result]);

  return (
    <PlainSelect
      className={cn(className)}
      items={audienceItems}
      label="Audience List"
      placeholder="Select an audience list"
      isDisabled={audienceItems.length === 0}
      {...props}
    />
  );
};
