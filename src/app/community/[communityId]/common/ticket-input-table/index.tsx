import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useFormContext } from '~/custom-hooks/hook-form';
import {
  TicketProvider,
  type MembershipConfig,
  type TicketListConfig,
  type TransactionConfig,
} from './ticket-context';
import { TicketListReadonly } from './ticket-list-readonly';
import {
  MembershipRow,
  TicketRow,
  TicketRowHeader,
  TransactionFooter,
  TransactionHeader,
  TransactionTotal,
} from './ticket-row';

export * from './_type';
export { TicketAddButton } from './ticket-add-button';

interface Props {
  className?: string;
  ticketListConfig: TicketListConfig;
  membershipConfig?: MembershipConfig;
  /**
   * In transaction mode, existing ticketLists will render as readonly.
   *
   * All new entries are added to a 'New Transaction' section, and a total is
   * displayed to make it easier to deal with new transaction.
   *
   * Payment Methods for membership and tickets will be hidden, payment will be
   * selected for the whole of transaction.
   */
  transactionConfig?: TransactionConfig;
  /**
   * When displaying select items, include hidden fields as well, applicable to:
   *
   * - Payment Methods
   * - Event Names
   */
  includeHiddenFields?: boolean;
  /**
   * Callback when a ticket item is removed
   *
   * NOTE: membership fee is not a ticket item, and cannot be removed
   */
  onRemove?: (ticketIdx: number) => void;
}

export const TicketInputTable: React.FC<Props> = ({
  className,
  ticketListConfig,
  membershipConfig,
  transactionConfig,
  includeHiddenFields,
  onRemove,
}) => {
  const { formState } = useFormContext();
  const { errors } = formState;
  const ticketListMethods = ticketListConfig.fieldMethods;
  const errObj = R.pathOr(
    errors,
    R.stringToPath(ticketListConfig.controlNamePrefix),
    {}
  );
  const error = React.useMemo<string | undefined>(() => {
    return errObj?.message as string;
  }, [errObj]);

  const bottomContent = React.useMemo(() => {
    if (!error) {
      return null;
    }

    return (
      <div className="flex items-center gap-4 pt-3">
        <div className="text-sm text-danger">{error}</div>
      </div>
    );
  }, [error]);

  // Don't render anything if there is nothing to show
  if (
    transactionConfig == null &&
    membershipConfig == null &&
    ticketListMethods.fields.length === 0
  ) {
    return null;
  }

  return (
    <TicketProvider
      ticketListConfig={ticketListConfig}
      membershipConfig={membershipConfig}
      transactionConfig={transactionConfig}
      includeHiddenFields={includeHiddenFields}
    >
      <div className={cn(className)}>
        <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
          <div className="grid grid-cols-[repeat(4,1fr)_75px] gap-2">
            <TicketRowHeader />
            <TicketListReadonly />
            {transactionConfig != null && <TransactionHeader />}
            <MembershipRow />
            {ticketListMethods.fields.map((row, ticketIdx) => (
              <TicketRow
                key={row.id}
                ticketIdx={ticketIdx}
                onRemove={() => onRemove?.(ticketIdx)}
              />
            ))}
            {transactionConfig != null && <TransactionFooter />}
            {transactionConfig != null && <TransactionTotal />}
          </div>
        </ScrollShadow>
        {bottomContent}
      </div>
    </TicketProvider>
  );
};
