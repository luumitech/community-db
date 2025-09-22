import React from 'react';
import { type TicketList } from '~/community/[communityId]/common/ticket-input-table/_type';
import { type UseFormReturn } from '~/custom-hooks/hook-form';
import { type InputData } from './use-hook-form';

export function usePreSubmit(formContext: UseFormReturn<InputData>) {
  const { watch, setValue } = formContext;
  const ticketList: TicketList = watch('event.ticketList');
  const membershipPaymentMethod = watch('membership.paymentMethod');
  const transactionPaymentMethod = watch('hidden.transaction.paymentMethod');

  const propagatePaymentMethod = React.useCallback(() => {
    if (!transactionPaymentMethod) {
      return;
    }

    if (!membershipPaymentMethod) {
      setValue('membership.paymentMethod', transactionPaymentMethod, {
        shouldDirty: true,
      });
    }

    // Backfill any tickets that don't have a payment method specified
    ticketList.forEach((entry, idx) => {
      if (!entry.paymentMethod) {
        setValue(
          `event.ticketList.${idx}.paymentMethod`,
          transactionPaymentMethod,
          {
            shouldDirty: true,
          }
        );
      }
    });
  }, [membershipPaymentMethod, setValue, ticketList, transactionPaymentMethod]);

  return { propagatePaymentMethod };
}
