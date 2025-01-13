import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { Input } from '~/view/base/input';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const TicketInput: React.FC<Props> = ({ className }) => {
  return (
    <Input
      className={clsx(className)}
      controlName="event.ticket"
      label="Ticket"
      type="number"
      min={0}
      isControlled
    />
  );
};
