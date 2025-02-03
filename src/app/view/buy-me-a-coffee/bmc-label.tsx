import { cn } from '@heroui/react';
import { Cookie } from 'next/font/google';
import React from 'react';

const cookie = Cookie({
  subsets: ['latin'],
  weight: ['400'],
});

interface Props {
  className?: string;
}

export const BmcLabel: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, cookie.className, 'text-xl')}>
      Buy me a coffee
    </div>
  );
};
