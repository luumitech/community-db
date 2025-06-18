import { Tab, Tabs, cn } from '@heroui/react';
import React from 'react';
import { getFragment } from '~/graphql/generated';
import { usePageContext } from '../page-context';
import { AudienceList } from './audience-list';
import { Settings } from './settings';
import { ModifyFragment } from './settings/use-hook-form';

interface Props {
  className?: string;
}

export const Mailchimp: React.FC<Props> = ({ className }) => {
  const { community: fragment } = usePageContext();
  const community = getFragment(ModifyFragment, fragment);
  const hasApiKey = community.mailchimpSetting?.apiKey != null;

  return (
    <Tabs
      classNames={{
        tabWrapper: 'h-full',
        tabList: 'bg-background',
        tab: 'justify-start',
        cursor: cn('rounded-none shadow-none', 'border-l-4 border-primary'),
        tabContent: 'group-data-[selected=true]:text-primary',
        // This allows the tab content to scroll
        panel: 'w-full flex flex-col gap-4 overflow-y-auto px-0 pl-3',
      }}
      aria-label="Mailchimp Menu"
      isVertical
    >
      <Tab key="audience-list" title="Audience List" isDisabled={!hasApiKey}>
        <AudienceList />
      </Tab>
      <Tab key="settings" title="Settings">
        <Settings />
      </Tab>
    </Tabs>
  );
};
