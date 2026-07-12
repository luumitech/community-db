import { Skeleton } from '@heroui/react';
import React from 'react';
import simplur from 'simplur';
import { type ContactInfo } from './_type';

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
      <span className="text-xs text-foreground/50">
        {simplur`Result contains ${contactCount} email[|s] from ${propertyCount} propert[y|ies]`}
      </span>
    </Skeleton>
  );
};
