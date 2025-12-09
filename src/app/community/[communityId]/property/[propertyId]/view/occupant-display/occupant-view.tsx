import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
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
  const match = /^(\d{3})(\d{3})(\d{4})$/.exec(cleaned);
  return !match ? phoneNumber : `(${match[1]}) ${match[2]}-${match[3]}`;
}

// variable name must be `className` for tailwindcss intellisense to work
const className = {
  container: 'grid grid-cols-2 gap-2 sm:grid-cols-7',
  inheritContainer: 'col-span-full grid grid-cols-subgrid',
  headerLabel: 'text-xs font-semibold text-default-400',
  name: 'sm:col-span-2',
  detail: 'col-span-2 sm:col-span-4',
  // Always last column
  optOut: '-col-start-1 row-start-1',
};

interface Props {
  className?: string;
  occupantList: OccupantEntry[];
}

export const OccupantView: React.FC<Props> = ({ occupantList, ...props }) => {
  return (
    <div className={props.className}>
      <div className={className.container} role="rowgroup">
        <OccupantHeader />
        {occupantList.map((occupant, idx) => {
          return <Occupant key={idx} entry={occupant} />;
        })}
      </div>
    </div>
  );
};

interface OccupantHeaderProps {
  className?: string;
}

const OccupantHeader: React.FC<OccupantHeaderProps> = ({ ...props }) => {
  return (
    <header
      className={twMerge(
        className.inheritContainer,
        className.headerLabel,
        'bg-default-100',
        'items-center',
        'rounded-lg',
        'h-8 px-3 py-0',
        // Hide header in small media query
        'hidden sm:grid',
        props.className
      )}
      role="rowheader"
    >
      <div className={className.name}>Name</div>
      <div className={className.detail}>Contact Info</div>
      <div className={className.optOut}>Opt out</div>
    </header>
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
        className.inheritContainer,
        'items-center gap-2',
        'font-normal text-foreground text-small',
        'px-4'
      )}
    >
      <div
        className={twMerge(
          /**
           * Bold the name in small media size, so it's easier to differentiate
           * between rows
           */
          'font-semibold sm:font-normal',
          className.name
        )}
      >
        {firstName} {lastName}
      </div>
      <div className={twMerge('flex flex-wrap gap-x-3', className.detail)}>
        {(infoList ?? []).map((info, idx) => {
          return <ContactInfo key={idx} entry={info} />;
        })}
      </div>
      <div className={className.optOut}>
        <OptOut entry={entry} />
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
