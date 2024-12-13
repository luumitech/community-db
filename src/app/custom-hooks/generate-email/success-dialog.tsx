import clsx from 'clsx';
import React from 'react';
import type { OccupantEntry, PropertyEntry } from './_type';
import { EmailString } from './email-string';
import { MailchimpCSV } from './mailchimp-csv';

/**
 * Convert propertyList into list of opted in contacts
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Opted in contact list
 */
function toContactList(propertyList: PropertyEntry[]) {
  const contactList = propertyList
    .flatMap(({ occupantList }) =>
      occupantList.map(({ optOut, ...other }) => {
        if (!!optOut || !other.email) {
          return null;
        }
        return other;
      })
    )
    .filter((entry): entry is OccupantEntry => entry != null);

  return contactList;
}

interface Props {
  className?: string;
  propertyList: PropertyEntry[];
}

export const SuccessDialog: React.FC<Props> = ({ className, propertyList }) => {
  const propertyCount = propertyList.length;

  const contactList = React.useMemo(
    () => toContactList(propertyList),
    [propertyList]
  );
  const contactCount = contactList.length;

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <p className="leading-4">
        <span>{contactCount} emails generated</span>
        <br />
        <span className="text-sm">(from {propertyCount} properties)</span>
      </p>
      <MailchimpCSV contactList={contactList} />
      <EmailString contactList={contactList} />
    </div>
  );
};
