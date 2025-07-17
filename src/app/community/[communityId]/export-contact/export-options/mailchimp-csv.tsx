import { Button, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { startDownloadBlob } from '~/lib/dom';
import { Icon } from '~/view/base/icon';
import { type ContactInfo } from '../contact-util';

/**
 * Convert contact list into Mailchimp compatible CSV
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Mailchimp compatible CSV
 */
function toMailchimpCSV(contactList: ContactInfo['contactList']) {
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
  contactInfo?: ContactInfo;
}

export const MailchimpCSV: React.FC<Props> = ({ className, contactInfo }) => {
  const { communityName } = useLayoutContext();
  const contactList = React.useMemo(() => {
    return contactInfo?.contactList ?? [];
  }, [contactInfo]);
  const contactCount = contactList.length;

  const onDownload = React.useCallback(() => {
    const csv = toMailchimpCSV(contactList);
    const blob = new Blob([csv], { type: 'text/csv' });
    const fn = R.toKebabCase(`${communityName ?? ''}Email.csv`);
    startDownloadBlob(blob, fn);
  }, [communityName, contactList]);

  return (
    <Button
      className={cn(className)}
      color="primary"
      variant="bordered"
      fullWidth
      isDisabled={contactCount === 0}
      endContent={<Icon icon="mailchimp" size={16} />}
      onPress={onDownload}
    >
      Save As Mailchimp CSV...
    </Button>
  );
};
