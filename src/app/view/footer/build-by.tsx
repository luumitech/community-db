import { Link, cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import logoImg from './luumitech-logo.png';

interface Props {
  className?: string;
}

export const BuiltBy: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex gap-3 items-center')}>
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
          <Link className="text-xs text-primary-400" href={appPath('privacy')}>
            {appLabel('privacy')}
          </Link>
          &nbsp;&&nbsp;
          <Link className="text-xs text-primary-400" href={appPath('terms')}>
            {appLabel('terms')}
          </Link>
        </div>
      </div>
    </div>
  );
};
