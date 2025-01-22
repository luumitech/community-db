import { Link } from '@nextui-org/react';
import clsx from 'clsx';
import { env } from 'next-runtime-env';
import Image from 'next/image';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { BmcButton } from '~/view/buy-me-a-coffee';
import logoImg from './luumitech-logo.png';

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
        <div className="flex gap-3 items-center justify-end">
          <Image
            className="object-fit rounded-md"
            src={logoImg}
            alt="LummiTech Logo"
            priority
            width={36}
            height={36}
          />
          <div>
            <div className="font-bold text-gray-600">
              <span>Built by </span>
              <Link href="https://luumitech.com" className="leading-5">
                LuumiTech
              </Link>
            </div>
            <div className="text-xs text-gray-400">
              <Link
                className="text-xs text-primary-400"
                href={appPath('privacy')}
              >
                {appLabel('privacy')}
              </Link>
              &nbsp;&&nbsp;
              <Link
                className="text-xs text-primary-400"
                href={appPath('terms')}
              >
                {appLabel('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
