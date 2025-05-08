import { Skeleton, cn } from '@heroui/react';
import React from 'react';
import { type ContactInfo } from '../contact-util';
import { useMakeTableData } from './make-table-data';
import { TableView } from './table-view';

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
}

export const ContactView: React.FC<Props> = ({ className, contactInfo }) => {
  const [pending, startTransition] = React.useTransition();
  const { data, columns, updateTable } = useMakeTableData();

  React.useEffect(() => {
    if (contactInfo != null) {
      startTransition(async () => {
        updateTable(contactInfo);
      });
    }
  }, [updateTable, contactInfo]);

  if (contactInfo == null || pending || !data || !columns) {
    return (
      <div className="flex flex-col grow mb-4 gap-3">
        <Skeleton className="h-8 rounded-lg" />
        <Skeleton className="grow rounded-lg" />
      </div>
    );
  }

  const { propertyCount, contactList } = contactInfo;
  const contactCount = contactList.length;

  return (
    <>
      <span className="text-tiny text-foreground-400">
        Result contains {contactCount} emails from {propertyCount} households
      </span>
      <TableView data={data} columns={columns} />
    </>
  );
};
