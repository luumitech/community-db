import { Radio, RadioGroup, RadioGroupProps, cn } from '@heroui/react';
import React from 'react';

interface Props extends RadioGroupProps {
  className?: string;
}

export const GroupBy: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={cn(className)}>
      <RadioGroup
        classNames={{
          base: cn('text-sm border-medium border-divider p-3 rounded-md'),
        }}
        label="Group by"
        orientation="horizontal"
        {...props}
      >
        <Radio classNames={{ label: cn('text-xs') }} value="none">
          None
        </Radio>
        <Radio classNames={{ label: cn('text-xs') }} value="ticketName">
          Ticket Type
        </Radio>
        <Radio classNames={{ label: cn('text-xs') }} value="paymentMethod">
          Payment Method
        </Radio>
      </RadioGroup>
    </div>
  );
};
