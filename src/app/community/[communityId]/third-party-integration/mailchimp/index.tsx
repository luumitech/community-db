import { useQuery } from '@apollo/client';
import { Button, Tab, Tabs, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../page-context';
import { Settings } from './settings';
import { ModifyFragment } from './settings/use-hook-form';
import { SyncContact } from './sync-contact';

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
        wrapper: 'h-full',
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
      <Tab key="sync-contacts" title="Sync Contacts" isDisabled={!hasApiKey}>
        <SyncContact />
      </Tab>
      <Tab key="settings" title="Settings">
        <Settings />
      </Tab>
    </Tabs>
  );
};
