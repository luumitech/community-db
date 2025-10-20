import React from 'react';
import { type TicketList } from '~/community/[communityId]/common/ticket-input-table/_type';
import { type UseFormReturn } from '~/custom-hooks/hook-form';
import { type InputData } from './use-hook-form';

export function usePreSubmit(formContext: UseFormReturn<InputData>) {
  const { watch, setValue, clearErrors } = formContext;
  const ticketList: TicketList = watch('event.ticketList');
  const applyToMembership = watch('hidden.transaction.applyToMembership');
  const transactionPaymentMethod = watch('hidden.transaction.paymentMethod');

  const propagatePaymentMethod = React.useCallback(() => {
    if (!transactionPaymentMethod) {
      return;
    }

    if (applyToMembership) {
      const controlName = 'membership.paymentMethod' as const;
      clearErrors(controlName);
      setValue(controlName, transactionPaymentMethod, { shouldDirty: true });
    }

    // Apply payment methods to all tickets within current transaction
    ticketList.forEach((entry, idx) => {
      const controlName = `event.ticketList.${idx}.paymentMethod` as const;
      clearErrors(controlName);
      setValue(controlName, transactionPaymentMethod, { shouldDirty: true });
    });
  }, [
    applyToMembership,
    setValue,
    clearErrors,
    ticketList,
    transactionPaymentMethod,
  ]);

  return { propagatePaymentMethod };
}
