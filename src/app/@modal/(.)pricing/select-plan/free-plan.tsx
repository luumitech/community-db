import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { usePlanContext } from '../plan-context';
import { PricePlan } from '../price-plan';

interface Props {
  className?: string;
}

export const FreePlan: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();

  const SwitchPlan = React.useCallback(() => {
    if (plan == null) {
      return <Button isLoading />;
    } else if (plan.isActive) {
      // Already subscribed to a plan
      return (
        <Button onClick={() => goToPanel('free')}>Downgrade to Free</Button>
      );
    } else {
      return <Button isDisabled>Your current plan</Button>;
    }
  }, [plan, goToPanel]);

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
