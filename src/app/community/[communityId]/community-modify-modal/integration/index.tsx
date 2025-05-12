import { cn } from '@heroui/react';
import React from 'react';
import { Mailchimp } from './mailchimp';

interface Props {
  className?: string;
}

export const Integration: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      <Mailchimp />
    </div>
  );
};
