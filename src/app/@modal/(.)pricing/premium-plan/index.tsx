import { Button, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { SubscriptionPlan } from '../_type';
import { PricePlan } from '../price-plan';
import { ProcessPaymentButton } from './process-payment-button';

interface Props {
  className?: string;
  plan: SubscriptionPlan;
  onBack?: () => void;
}

export const PremiumPlan: React.FC<Props> = ({ className, onBack }) => {
  return (
    <div className={clsx(className, 'flex items-start')}>
      <Button isIconOnly variant="light" onClick={onBack}>
        <Icon icon="back" />
      </Button>
      <div>
        <p className="mt-2">New Plan:</p>
        <PricePlan
          price={process.env.NEXT_PUBLIC_PLAN_COST!}
          planName={process.env.NEXT_PUBLIC_PLAN_NAME}
        />
      </div>
      <Spacer x={6} />
      <ProcessPaymentButton color="primary" onSuccess={onBack}>
        Proceed To Payment
      </ProcessPaymentButton>
    </div>
  );
};
