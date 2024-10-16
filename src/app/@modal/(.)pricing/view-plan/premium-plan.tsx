import { Button } from '@nextui-org/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { SubscriptionPlan } from '../_type';
import { ProcessPaymentButton } from '../process-payment-button';
import { PricePlan } from './price-plan';

interface Props {
  className?: string;
  plan?: SubscriptionPlan;
}

export const PremiumPlan: React.FC<Props> = ({ className, plan }) => {
  const SwitchPlan = React.useCallback(() => {
    if (plan?.status === 'active') {
      // Already subscribed to a plan
      return <Button isDisabled>Your current plan</Button>;
    }
    return (
      <ProcessPaymentButton color="primary">
        Upgrade to {process.env.NEXT_PUBLIC_PLAN_NAME}
      </ProcessPaymentButton>
    );
  }, [plan]);

  return (
    <PricePlan
      className={className}
      planName={
        <div className="flex items-center gap-1">
          <Icon className="text-yellow-600" icon="premium-plan" size={20} />
          {process.env.NEXT_PUBLIC_PLAN_NAME}
        </div>
      }
      price={process.env.NEXT_PUBLIC_PLAN_COST ?? 'n/a'}
      button={<SwitchPlan />}
    >
      <ul className="list-disc pl-4">
        <li>Up to 5 databases</li>
        <li>Up to 1000 addresses per database</li>
      </ul>
    </PricePlan>
  );
};
