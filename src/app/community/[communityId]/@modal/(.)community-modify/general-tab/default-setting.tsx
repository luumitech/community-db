import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CurrencyInput } from '~/view/base/currency-input';

interface Props {
  className?: string;
}

export const DefaultSetting: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <span className="text-sm font-semibold text-foreground-500">
        Default Settings
      </span>
      <CurrencyInput
        label="Membership Fee"
        controlName="defaultSetting.membershipFee"
        variant="bordered"
      />
    </div>
  );
};
