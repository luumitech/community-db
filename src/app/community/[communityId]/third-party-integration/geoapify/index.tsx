import { Tab, Tabs, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment } from '~/graphql/generated';
import { usePageContext } from '../page-context';
import { Settings } from './settings';
import { ModifyFragment } from './settings/use-hook-form';

interface Props {
  className?: string;
}

export const Geoapify: React.FC<Props> = ({ className }) => {
  const { isSmDevice } = useAppContext();
  const { community: fragment } = usePageContext();
  const community = getFragment(ModifyFragment, fragment);
  const hasApiKey = community.geoapifySetting?.apiKey != null;

  return (
    <Tabs
      classNames={{
        tabWrapper: 'h-full',
        tabList: 'bg-background',
        tab: 'justify-start',
        tabContent: 'group-data-[selected=true]:text-primary',
        ...(!isSmDevice && {
          cursor: cn(
            'rounded-none shadow-none',
            // Vertical bar on left of tab item
            'border-l-4 border-primary'
          ),
        }),
        panel: cn(
          // This allows the tab content to scroll
          'flex h-full flex-col overflow-y-auto',
          'mt-3 w-full py-0'
        ),
      }}
      aria-label="Geoapify Menu"
      isVertical={!isSmDevice}
    >
      <Tab key="settings" title="Settings">
        <Settings />
      </Tab>
    </Tabs>
  );
};
