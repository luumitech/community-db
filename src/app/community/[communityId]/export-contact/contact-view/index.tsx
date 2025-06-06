import React from 'react';
import { type ContactInfo } from '../contact-util';
import { ContactSummary } from './contact-summary';
import { TableView } from './table-view';

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
  isLoading?: boolean;
}

export const ContactView: React.FC<Props> = ({
  className,
  contactInfo,
  isLoading,
}) => {
  const contactList = contactInfo?.contactList;

  return (
    <>
      <ContactSummary contactInfo={contactInfo} isLoading={isLoading} />
      <div className="flex-grow overflow-auto relative">
        <TableView contactList={contactList} isLoading={isLoading} />
      </div>
    </>
  );
};
