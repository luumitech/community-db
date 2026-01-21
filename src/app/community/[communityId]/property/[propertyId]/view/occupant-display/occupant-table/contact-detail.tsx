import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { ContactInfoEntry } from '../_type';

interface Props {
  className?: string;
  contactInfoList?: ContactInfoEntry[] | null;
}

export const ContactDetail: React.FC<Props> = ({
  className,
  contactInfoList,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-x-3', className)}>
      {(contactInfoList ?? []).map((info, idx) => {
        return <ContactInfo key={idx} entry={info} />;
      })}
    </div>
  );
};

/**
 * Converts a 10 digit phone number to (xxx)xxx-xxxx format
 *
 * @param {any} phoneNumber
 */
function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) {
    return null;
  }
  const cleaned = phoneNumber.toString().replace(/\D/g, '');
  const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);
  return !match ? phoneNumber : `(${match[1]}) ${match[2]}-${match[3]}`;
}

interface ContactInfoProps {
  entry: ContactInfoEntry;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ entry }) => {
  const { type, label, value } = entry;

  const renderValue = React.useMemo(() => {
    switch (type) {
      case GQL.ContactInfoType.Email:
        return (
          <div className="flex items-center gap-1">
            <Icon className="text-default-500" icon="email" />
            {value}
          </div>
        );
      case GQL.ContactInfoType.Phone:
        return (
          <div className="flex items-center gap-1">
            <span className="text-default-500">{label}</span>
            {formatPhoneNumber(value)}
          </div>
        );
      default:
        return value;
    }
  }, [label, type, value]);

  return <div className="whitespace-nowrap">{renderValue}</div>;
};
