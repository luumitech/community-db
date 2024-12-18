import { Divider, Link } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import logoImg from './luumitech-logo.png';

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, 'bg-green-300 p-4')}>
      <div className="sm:flex sm:justify-between items-center">
        <div className="divide-x divide-gray-600">
          <Link isBlock href={appPath('pricingPlan')}>
            Pricing Plan
          </Link>
          <Link
            href={appPath('contactUs')}
            isBlock
            showAnchorIcon
            anchorIcon={<Icon className="mx-1" icon="email" />}
          >
            {appLabel('contactUs')}
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <Image
            className="object-fit rounded-md"
            src={logoImg}
            alt="LummiTech Logo"
            priority
            width={36}
            height={36}
          />
          <div className="font-bold text-gray-600">
            <span>Built by </span>
            <Link href="https://luumitech.com" className="leading-5">
              LuumiTech
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
