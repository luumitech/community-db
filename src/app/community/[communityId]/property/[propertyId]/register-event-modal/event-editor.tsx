import clsx from 'clsx';
import React from 'react';
import { EventDatePicker } from './event-date-picker';
import { NotesEditor } from './notes-editor';
import { PaymentInfoEditor } from './payment-info-editor';
import { TicketInput } from './ticket-input';

interface Props {
  className?: string;
}

export const EventEditor: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <PaymentInfoEditor className="max-w-sm" />
      <div className="flex gap-2">
        <EventDatePicker className="max-w-sm" />
        <TicketInput className="max-w-sm" />
      </div>
      <NotesEditor className="mt-4" />
    </div>
  );
};
