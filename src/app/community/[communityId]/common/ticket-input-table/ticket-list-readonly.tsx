import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useToggle } from 'react-use';
import { useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { Icon } from '~/view/base/icon';
import { useTicketContext } from './ticket-context';

interface EmptyProps {}

export const TicketListReadonly: React.FC<EmptyProps> = () => {
  const { transactionConfig, membershipConfig } = useTicketContext();
  const { getValues } = useFormContext();
  const prevXact = usePreviousTransaction();

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
      <TicketListHeader prevXact={prevXact} />
      <AnimatePresence initial={false}>
        {prevXact.isExpanded && (
          <motion.div
            aria-label="Previous Transaction List"
            className="col-span-full grid grid-cols-subgrid gap-1 overflow-hidden"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
          >
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
            <TicketListTotal prevXact={prevXact} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface PreviousTransaction {
  prevXact: ReturnType<typeof usePreviousTransaction>;
}

function usePreviousTransaction() {
  const [isExpanded, toggle] = useToggle(false);
  const { transactionConfig, membershipConfig } = useTicketContext();
  const { ticketList = [] } = transactionConfig ?? {};
  const { getValues } = useFormContext();

  const includeMembershipFee =
    membershipConfig != null && !membershipConfig?.canEdit;
  const totalPrice = decSum(
    includeMembershipFee
      ? getValues(`${membershipConfig.controlNamePrefix}.price`)
      : 0,
    ...ticketList.map(({ price }) => price)
  );

  return {
    ticketCount: ticketList.length + (includeMembershipFee ? 1 : 0),
    totalPrice,
    isExpanded,
    toggle,
  };
}

interface TicketRowProps {
  ticket: Omit<GQL.Ticket, '__typename'>;
}

const TicketRow: React.FC<TicketRowProps> = ({ ticket }) => {
  return (
    <div
      className={cn('col-span-full mx-3 grid grid-cols-subgrid', 'text-sm')}
      role="row"
    >
      <div className="pl-1" role="cell" />
      <div className="pl-1" role="cell">
        {ticket.ticketName ?? ''}
      </div>
      <div className="pl-1" role="cell">
        {ticket.count ?? ''}
      </div>
      <div className="pl-1" role="cell">
        <span className="pr-1.5 text-default-400"> $</span>
        <span>{formatCurrency(ticket.price)}</span>
      </div>
      <div className="pl-1" role="cell">
        {ticket.paymentMethod ?? ''}
      </div>
      <div className="pl-1" role="cell" />
    </div>
  );
};

const TicketListHeader: React.FC<PreviousTransaction> = ({ prevXact }) => {
  const { ticketCount, isExpanded, toggle } = prevXact;

  return (
    <div className={cn('col-span-full grid')}>
      <div
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border-medium border-divider px-2',
          'cursor-pointer hover:opacity-hover'
        )}
        aria-label="Previous Transaction Toggle"
        role="button"
        onClick={toggle}
      >
        <motion.div
          className="justify-self-center"
          role="cell"
          animate={{
            rotate: isExpanded ? 90 : 0,
          }}
        >
          <Icon icon="chevron-forward" />
        </motion.div>
        <span className="text-sm">Previous Transactions ({ticketCount})</span>
      </div>
    </div>
  );
};

export const TicketListTotal: React.FC<PreviousTransaction> = ({
  prevXact,
}) => {
  const { totalPrice } = prevXact;

  return (
    <div
      className={cn(
        'col-span-full grid grid-cols-subgrid',
        'items-center bg-default-100',
        'h-10 rounded-lg'
      )}
      role="row"
    >
      <div role="cell" />
      <div
        role="cell"
        className="col-span-2 text-right text-sm text-default-500"
      >
        Previous Total
      </div>
      <div className="pl-1 text-sm" role="cell">
        <span className="pr-1.5 text-default-400">$</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div role="cell" />
      <div className="flex gap-2" role="cell" />
    </div>
  );
};
