import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { SubscriptionPlan } from '../_type';
import { PricePlan } from './price-plan';

interface Props {
  className?: string;
  plan?: SubscriptionPlan;
}

export const FreePlan: React.FC<Props> = ({ className, plan }) => {
  const SwitchPlan = React.useCallback(() => {
    if (plan?.status === 'active') {
      // Already subscribed to a plan
      return <Button>Downgrade to Free</Button>;
    }
    return <Button isDisabled>Your current plan</Button>;
  }, [plan]);

  return (
    <PricePlan
      className={className}
      planName="Free"
      price="0"
      button={<SwitchPlan />}
    >
      <ul className="list-disc pl-4">
        <li>1 database</li>
        <li>Up to 10 addresses per database</li>
      </ul>
    </PricePlan>
  );
};
