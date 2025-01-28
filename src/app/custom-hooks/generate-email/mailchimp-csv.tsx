import { Button } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { useAppContext } from '~/custom-hooks/app-context';
import { startDownloadBlob } from '~/lib/dom';
import { Icon } from '~/view/base/icon';
import type { OccupantEntry } from './_type';

/**
 * Convert contact list into Mailchimp compatible CSV
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Mailchimp compatible CSV
 */
function toMailchimpCSV(contactList: OccupantEntry[]) {
  const aoa = [
    ['Email Address', 'First Name', 'Last Name'],
    ...contactList.map((entry) => [
      entry.email,
      entry.firstName,
      entry.lastName,
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return csv;
}

interface Props {
  className?: string;
  contactList: OccupantEntry[];
}

export const MailchimpCSV: React.FC<Props> = ({ className, contactList }) => {
  const { communityName } = useAppContext();
  const contactCount = contactList.length;

  const onDownload = React.useCallback(() => {
    const csv = toMailchimpCSV(contactList);
    const blob = new Blob([csv], { type: 'text/csv' });
    const fn = R.toKebabCase(`${communityName ?? ''}Email.csv`);
    startDownloadBlob(blob, fn);
  }, [communityName, contactList]);

  return (
    <Button
      className={clsx(className)}
      color="primary"
      variant="faded"
      size="sm"
      isDisabled={contactCount === 0}
      endContent={<Icon icon="mailchimp" size={16} />}
      onPress={onDownload}
    >
      Save As Mailchimp CSV...
    </Button>
  );
};
