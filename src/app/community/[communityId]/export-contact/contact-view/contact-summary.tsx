import { Skeleton } from '@heroui/react';
import React from 'react';
import { type ContactInfo } from '../contact-util';

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
  isLoading?: boolean;
}

export const ContactSummary: React.FC<Props> = ({
  className,
  contactInfo,
  isLoading,
}) => {
  const propertyCount = contactInfo?.propertyCount ?? 0;
  const contactCount = contactInfo?.contactList.length ?? 0;

  return (
    <Skeleton className="rounded-md" isLoaded={!isLoading}>
      <span className="text-foreground-400 text-tiny">
        Result contains {contactCount} emails from {propertyCount} households
      </span>
    </Skeleton>
  );
};
