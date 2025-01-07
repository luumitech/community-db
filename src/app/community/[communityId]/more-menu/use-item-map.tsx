import React from 'react';
import { useGenerateEmail } from '~/custom-hooks/generate-email';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { type MenuItemEntry } from '~/view/header';

interface ItemMapOpt {
  communityId: string;
}

/** Configure all possible menu items */
export function useItemMap(opt: ItemMapOpt) {
  const generateEmail = useGenerateEmail();

  const itemMap = React.useMemo(() => {
    const result = new Map<string, MenuItemEntry>();
    const { communityId } = opt;

    result.set('propertyList', {
      key: 'propertyList',
      href: appPath('propertyList', { path: { communityId } }),
      endContent: <Icon icon="property-list" />,
      children: appLabel('propertyList'),
    });

    result.set('communityDashboard', {
      key: 'communityDashboard',
      href: appPath('communityDashboard', { path: { communityId } }),
      endContent: <Icon icon="dashboard" />,
      children: appLabel('communityDashboard'),
    });

    result.set('communityShare', {
      key: 'communityShare',
      href: appPath('communityShare', { path: { communityId } }),
      endContent: <Icon icon="share" />,
      children: appLabel('communityShare'),
    });

    result.set('exportEmail', {
      key: 'exportEmail',
      endContent: <Icon icon="copy" />,
      onPress: () => generateEmail(),
      children: 'Export Email List',
      description: 'Modify filter to alter list',
    });

    result.set('communityExport', {
      key: 'communityExport',
      href: appPath('communityExport', { path: { communityId } }),
      children: appLabel('communityExport'),
    });

    result.set('communityImport', {
      key: 'communityImport',
      href: appPath('communityImport', { path: { communityId } }),
      children: appLabel('communityImport'),
    });

    return result;
  }, [opt, generateEmail]);

  return itemMap;
}
