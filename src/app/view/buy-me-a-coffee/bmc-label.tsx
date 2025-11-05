import { Cookie } from 'next/font/google';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const cookie = Cookie({
  subsets: ['latin'],
  weight: ['400'],
});

interface Props {
  className?: string;
}

export const BmcLabel: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('text-xl', cookie.className, className)}>
      Buy me a coffee
    </div>
  );
};
