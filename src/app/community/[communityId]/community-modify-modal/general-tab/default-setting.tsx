import { cn } from '@heroui/react';
import React from 'react';
import { CurrencyInput } from '~/view/base/currency-input';

interface Props {
  className?: string;
}

export const DefaultSetting: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <span className="text-foreground-500 font-semibold text-sm">
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
