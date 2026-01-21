import { useQuery } from '@apollo/client';
import { Select, SelectItem, cn, type SelectProps } from '@heroui/react';
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

interface SelectItem {
  key: string;
  label: string;
}

type CustomProps = Omit<SelectProps<SelectItem>, 'children'>;

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

  const audienceItems: SelectItem[] = React.useMemo(() => {
    const list = result.data?.mailchimpAudienceList ?? [];
    return list.map((audience) => ({
      key: audience.listId,
      label: audience.name,
    }));
  }, [result]);

  return (
    <Select
      className={cn(className)}
      items={audienceItems}
      label="Audience List"
      placeholder="Select an audience list"
      isDisabled={audienceItems.length === 0}
      {...props}
    >
      {(item) => <SelectItem>{item.label}</SelectItem>}
    </Select>
  );
};
