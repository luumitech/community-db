'use client';
import { Link, cn } from '@heroui/react';
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
    <div className={cn(className, 'p-4', 'bg-green-300 dark:bg-neutral-800')}>
      <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2')}>
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
