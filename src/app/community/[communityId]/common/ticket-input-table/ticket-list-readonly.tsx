import clsx from 'clsx';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { formatCurrency } from '~/lib/decimal-util';
import { useTicketContext } from './ticket-context';

export const TicketListReadonly: React.FC<{}> = () => {
  const { transactionConfig, membershipConfig } = useTicketContext();
  const { getValues } = useFormContext();

  if (transactionConfig == null) {
    return null;
  }

  const showMembershipInfo =
    membershipConfig != null && !membershipConfig.canEdit;
  const membershipPrice = getValues(
    `${membershipConfig?.controlNamePrefix}.price`
  );
  const membershipPaymentMethod = getValues(
    `${membershipConfig?.controlNamePrefix}.paymentMethod`
  );

  return (
    <>
      {showMembershipInfo && (
        <TicketRow
          ticket={{
            ticketName: 'Membership Fee',
            count: null,
            price: membershipPrice ?? '',
            paymentMethod: membershipPaymentMethod ?? '',
          }}
        />
      )}
      {transactionConfig?.ticketList?.map((row, idx) => (
        <TicketRow key={`ticket-list-readonly-${idx}`} ticket={row} />
      ))}
    </>
  );
};

interface TicketRowProps {
  ticket: Omit<GQL.Ticket, '__typename'>;
}

const TicketRow: React.FC<TicketRowProps> = ({ ticket }) => {
  return (
    <div
      className={clsx('grid col-span-full grid-cols-subgrid mx-3', 'text-sm')}
      role="row"
    >
      <div className="pl-1" role="cell">
        {ticket.ticketName ?? ''}
      </div>
      <div className="pl-1" role="cell">
        {ticket.count ?? ''}
      </div>
      <div className="pl-1" role="cell">
        <span className="text-default-400 pr-1.5"> $</span>
        <span>{formatCurrency(ticket.price)}</span>
      </div>
      <div className="pl-1" role="cell">
        {ticket.paymentMethod ?? ''}
      </div>
      <div className="pl-1" role="cell" />
    </div>
  );
};
