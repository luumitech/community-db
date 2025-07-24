import { Link } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel, appPath } from '~/lib/app-path';
import { useHookFormContext } from '../use-hook-form';

/**
 * Check if selected method is allowed to be selected.
 *
 * For example:
 *
 * - ImportMethod.Map requires Geoapify keys to be specified
 */
export function useCheckMethodRequirement() {
  const { communityId, hasGeoapifyApiKey } = useLayoutContext();
  const { watch } = useHookFormContext();
  const method = watch('method');

  const msg = React.useMemo(() => {
    // ImportMethod.Map requries GeoapifyApiKey
    switch (method) {
      case GQL.ImportMethod.Map:
        if (!hasGeoapifyApiKey) {
          return (
            <p className="text-danger text-sm">
              This import method requires a valid Geoapify API key. To enable
              this feature, please enter your API key in the{' '}
              <Link
                size="sm"
                href={appPath('thirdPartyIntegration', {
                  path: { communityId },
                  query: { tab: 'geoapify' },
                })}
              >
                {appLabel('thirdPartyIntegration')}
              </Link>{' '}
              settings.
            </p>
          );
        }
        break;
    }
    return null;
  }, [communityId, hasGeoapifyApiKey, method]);

  return msg;
}
