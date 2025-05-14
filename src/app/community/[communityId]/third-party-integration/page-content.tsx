import { useQuery } from '@apollo/client';
import { cn } from '@heroui/react';
import { Tab, Tabs } from '@heroui/tabs';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { appLabel } from '~/lib/app-path';
import { Mailchimp } from './mailchimp';
import { PageProvider } from './page-context';

const ThirdPartyIntegration_CommunityQuery = graphql(/* GraphQL */ `
  query thirdPartyIntegrationCommunity($id: String!) {
    communityFromId(id: $id) {
      id
      ...ThirdPartyIntegration_Mailchimp_Settings
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ className, communityId }) => {
  const result = useQuery(ThirdPartyIntegration_CommunityQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);

  const community = result.data?.communityFromId;
  if (community == null) {
    return null;
  }

  return (
    <PageProvider community={community}>
      <div className={cn(className)}>
        <Tabs
          aria-label={appLabel('thirdPartyIntegration')}
          classNames={{
            tabList:
              'gap-6 w-full relative rounded-none p-0 border-b border-divider',
            tab: 'max-w-fit px-0 h-12',
          }}
          color="primary"
          variant="underlined"
        >
          <Tab key="mailchimp" title="Mailchimp">
            <Mailchimp />
          </Tab>
        </Tabs>
      </div>
    </PageProvider>
  );
};
