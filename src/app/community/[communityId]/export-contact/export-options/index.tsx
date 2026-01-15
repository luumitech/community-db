import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type ContactInfo } from '../_type';
import { EmailString } from './email-string';
import { MailchimpCSV } from './mailchimp-csv';

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
}

export const ExportOptions: React.FC<Props> = ({ className, contactInfo }) => {
  return (
    <div className={twMerge('flex max-w-xs flex-col gap-2', className)}>
      <MailchimpCSV contactInfo={contactInfo} />
      <EmailString contactInfo={contactInfo} />
    </div>
  );
};
