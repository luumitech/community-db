import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { FlatButton } from '~/view/base/flat-button';
import { Input } from '~/view/base/input';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const TicketInput: React.FC<Props> = ({ className }) => {
  const { communityUi } = useAppContext();
  const { actions, defaultTicket } = communityUi;
  const { watch } = useHookFormContext();
  const ticket = watch('event.ticket');
  const enableSetDefaultTicket = defaultTicket !== ticket;

  return (
    <Input
      className={clsx(className)}
      controlName="event.ticket"
      label="Ticket"
      type="number"
      min={0}
      isControlled
      endContent={
        <div>
          <FlatButton
            icon="ticket"
            tooltip={
              enableSetDefaultTicket
                ? `Change ticket default to ${ticket}`
                : `Ticket default is ${ticket}`
            }
            onClick={() => actions.setDefaultTicket(ticket)}
            disabled={!enableSetDefaultTicket}
          />
        </div>
      }
    />
  );
};
