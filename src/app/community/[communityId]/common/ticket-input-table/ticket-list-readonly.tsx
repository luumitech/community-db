import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useToggle } from 'usehooks-ts';
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
            className="overflow-hidden grid col-span-full grid-cols-subgrid gap-1"
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
      className={cn('grid col-span-full grid-cols-subgrid mx-3', 'text-sm')}
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

const TicketListHeader: React.FC<PreviousTransaction> = ({ prevXact }) => {
  const { ticketCount, isExpanded, toggle } = prevXact;

  return (
    <div className={cn('grid col-span-full')}>
      <div
        className={cn(
          'h-10 border-divider border-medium rounded-md flex items-center px-2 gap-2',
          'cursor-pointer hover:opacity-hover'
        )}
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
        'grid col-span-full grid-cols-subgrid',
        'bg-default-100 items-center',
        'rounded-lg h-10'
      )}
      role="row"
    >
      <div
        role="cell"
        className="col-span-2 text-sm text-right text-default-500"
      >
        Previous Total
      </div>
      <div className="pl-1 text-sm" role="cell">
        <span className="text-default-400 pr-1.5">$</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div role="cell" />
      <div className="flex gap-2" role="cell" />
    </div>
  );
};
