import { Link } from '@heroui/react';
import clsx from 'clsx';
import { env } from 'next-runtime-env';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { BmcButton } from '~/view/buy-me-a-coffee';
import { BuiltBy } from './build-by';

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  const subscriptionPlanEnable = env('NEXT_PUBLIC_PLAN_ENABLE') === 'true';

  return (
    <div className={clsx(className, 'bg-green-300 p-4')}>
      <div className={clsx('grid grid-cols-1 sm:grid-cols-2 gap-3')}>
        <div className="flex items-center divide-x divide-gray-600">
          {subscriptionPlanEnable ? (
            <Link isBlock href={appPath('pricingPlan')}>
              {appLabel('pricingPlan')}
            </Link>
          ) : (
            <BmcButton className="px-2" />
          )}
          <Link
            href={appPath('contactUs')}
            isBlock
            showAnchorIcon
            anchorIcon={<Icon className="mx-1" icon="email" />}
          >
            {appLabel('contactUs')}
          </Link>
        </div>
        <BuiltBy className="justify-end" />
      </div>
    </div>
  );
};
