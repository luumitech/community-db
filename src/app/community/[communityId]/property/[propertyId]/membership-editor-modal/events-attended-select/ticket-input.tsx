import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { FlatButton } from '~/view/base/flat-button';
import { Input } from '~/view/base/input';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
  eventIdx: number;
}

export const TicketInput: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
}) => {
  const { communityUi } = useAppContext();
  const { actions, defaultTicket } = communityUi;
  const { watch } = useHookFormContext();
  const ticket = watch(
    `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticket`
  );
  const enableSetDefaultTicket = defaultTicket !== ticket;

  return (
    <Input
      className={clsx(className)}
      controlName={`membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticket`}
      aria-label="Ticket"
      variant="underlined"
      type="number"
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
