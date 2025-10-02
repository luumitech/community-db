import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import type { ContactInfoEntry, OccupantEntry } from './_type';
import { OptOut } from './opt-out';

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
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return !match ? phoneNumber : `(${match[1]}) ${match[2]}-${match[3]}`;
}

const classNames = {
  name: 'col-span-1 sm:col-span-2',
  optOut: 'col-span-1',
  detail: 'col-span-2 sm:col-span-4',
};

interface Props {
  className?: string;
  occupantList: OccupantEntry[];
}

export const OccupantView: React.FC<Props> = ({ className, occupantList }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2" role="rowgroup">
        <header
          className={cn(
            'grid col-span-full grid-cols-subgrid items-center',
            'text-foreground-500 bg-default-100 text-tiny font-semibold',
            'rounded-lg',
            'h-14 sm:h-8 px-3 py-1 sm:py-0'
          )}
        >
          <div className={classNames.name}>Name</div>
          <div className={classNames.optOut}>Opt out</div>
          <div className={classNames.detail}>Details</div>
        </header>
        {occupantList.map((occupant, idx) => {
          return <Occupant key={idx} entry={occupant} />;
        })}
      </div>
    </div>
  );
};

interface OccupantProps {
  entry: OccupantEntry;
}

const Occupant: React.FC<OccupantProps> = ({ entry }) => {
  const { firstName, lastName, infoList } = entry;

  return (
    <div
      className={cn(
        'grid col-span-full grid-cols-subgrid items-center gap-2',
        'text-foreground text-small font-normal',
        'px-4'
      )}
    >
      <div
        className={cn(
          /**
           * Bold the name in small media size, so it's easier to differentiate
           * between rows
           */
          'font-semibold sm:font-normal',
          classNames.name
        )}
      >
        {firstName} {lastName}
      </div>
      <div className={classNames.optOut}>
        <OptOut entry={entry} />
      </div>
      <div className={cn(classNames.detail, 'flex flex-wrap gap-x-3')}>
        {(infoList ?? []).map((info, idx) => {
          return <ContactInfo key={idx} entry={info} />;
        })}
      </div>
    </div>
  );
};

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
