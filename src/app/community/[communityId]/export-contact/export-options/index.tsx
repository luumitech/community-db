import { cn } from '@heroui/react';
import React from 'react';
import { type ContactInfo } from '../contact-util';
import { EmailString } from './email-string';
import { MailchimpCSV } from './mailchimp-csv';

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
}

export const ExportOptions: React.FC<Props> = ({ className, contactInfo }) => {
  return (
    <div className={cn(className, 'max-w-xs flex flex-col gap-2')}>
      <MailchimpCSV contactInfo={contactInfo} />
      <EmailString contactInfo={contactInfo} />
    </div>
  );
};
