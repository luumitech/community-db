import { cn } from '@heroui/react';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import { FlatButton } from '~/view/base/flat-button';
import { PaymentDatePicker } from '../payment-date-picker';
import { PaymentSelect } from '../payment-select';
import { useTicketContext, type MembershipConfig } from '../ticket-context';
import { MembershipPriceInput } from './membership-price-input';

interface Props extends MembershipConfig {
  onRemove?: () => void;
}

export const MembershipEdit: React.FC<Props> = ({
  onRemove,
  ...membershipConfig
}) => {
  const { transactionConfig, includeHiddenFields } = useTicketContext();
  const { setValue, watch } = useFormContext();
  const membershipPrefix = membershipConfig.controlNamePrefix;
  const transactionPaymentMethod = watch(
    `${transactionConfig?.paymentControlName}`
  );

  return (
    <>
      <div role="cell" className="col-span-2 pt-2 pl-1 text-sm">
        Membership Fee
      </div>
      <div role="cell">
        <MembershipPriceInput controlNamePrefix={membershipPrefix} />
      </div>
      <div role="cell">
        <PaymentDatePicker controlNamePrefix={membershipPrefix} />
      </div>
      <div role="cell">
        <PaymentSelect
          controlNamePrefix={membershipPrefix}
          includeHiddenFields={includeHiddenFields}
          /**
           * In transaction mode, it is not necessary to specify payment method
           * for membership row. If the transaction payment method has been
           * specified, we show it as placeholder
           */
          {...(transactionPaymentMethod != null && {
            placeholder: transactionPaymentMethod,
          })}
        />
      </div>
      <div className="flex gap-2 pt-3" role="cell">
        <FlatButton
          className="text-danger"
          icon="cross"
          tooltip="Remove Membership"
          onClick={() => {
            setValue(`${membershipPrefix}.isMember`, false);
            setValue(`${membershipPrefix}.paymentEventName`, null);
            setValue(`${membershipPrefix}.paymentMethod`, null);
            setValue(`${membershipPrefix}.paymentDeposited`, null);
            // Wait for remove operation to complete before calling other onRemove handlers
            setTimeout(() => onRemove?.());
          }}
        />
      </div>
    </>
  );
};
