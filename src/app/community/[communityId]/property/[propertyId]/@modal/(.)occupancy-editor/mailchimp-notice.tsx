import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env';
import { Link } from '~/view/base/link';

interface Props {
  className?: string;
}

export const MailchimpNotice: React.FC<Props> = ({ className }) => {
  const { community } = useLayoutContext();
  const hasMailchimpApiKey = community.mailchimpSetting?.apiKey != null;

  if (!hasMailchimpApiKey) {
    return null;
  }

  return (
    <div className={cn('text-xs font-normal text-default-400', className)}>
      This change applies only to the {appTitle}. To update contact information
      in Mailchimp, use{' '}
      <Link
        className="text-[length:inherit]"
        href={appPath('thirdPartyIntegration', {
          path: { communityId: community.id },
          query: { tab: 'mailchimp' },
        })}
      >
        Mailchimp {appLabel('thirdPartyIntegration')}
      </Link>{' '}
      or visit the{' '}
      <Link
        className="text-[length:inherit]"
        href="http://www.mailchimp.com"
        isExternal
        showAnchorIcon
      >
        Mailchimp
      </Link>{' '}
      website.
    </div>
  );
};
