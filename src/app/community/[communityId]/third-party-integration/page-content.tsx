import { useQuery } from '@apollo/client';
import { Tab, Tabs } from '@heroui/tabs';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appLabel } from '~/lib/app-path';
import Loading from '~/loading';
import { Geoapify } from './geoapify';
import { Mailchimp } from './mailchimp';
import { PageProvider } from './page-context';

const ThirdPartyIntegration_CommunityQuery = graphql(/* GraphQL */ `
  query thirdPartyIntegrationCommunity($id: String!) {
    communityFromId(id: $id) {
      id
      ...ThirdPartyIntegration_Mailchimp_Settings
      ...ThirdPartyIntegration_Geoapify_Settings
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  defaultTab?: string;
}

export const PageContent: React.FC<Props> = ({
  className,
  communityId,
  defaultTab = 'mailchimp',
}) => {
  const result = useQuery(ThirdPartyIntegration_CommunityQuery, {
    variables: { id: communityId },
    onError,
  });

  const community = result.data?.communityFromId;
  if (community == null) {
    return <Loading />;
  }

  return (
    <PageProvider community={community}>
      <div className={className}>
        <Tabs
          aria-label={appLabel('thirdPartyIntegration')}
          classNames={{
            tabList:
              'gap-6 w-full relative rounded-none p-0 border-b border-divider',
            tab: 'max-w-fit px-0 h-12',
            panel: 'p-0 pt-3 grow overflow-hidden',
          }}
          color="primary"
          variant="underlined"
          defaultSelectedKey={defaultTab}
        >
          <Tab key="mailchimp" title="Mailchimp">
            <Mailchimp />
          </Tab>
          <Tab key="geoapify" title="Geoapify">
            <Geoapify />
          </Tab>
        </Tabs>
      </div>
    </PageProvider>
  );
};
