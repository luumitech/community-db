import { cn } from '@heroui/react';
import React from 'react';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const Mailchimp: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <span className="text-foreground-500 font-semibold text-sm">
        Mailchimp Integration
      </span>
      <Input
        className={className}
        controlName="mailchimpSetting.apiKey"
        variant="bordered"
        label="API key"
        description="Provide ability to synchronize Mailchimp audience with community-db contact list"
      />
    </div>
  );
};
