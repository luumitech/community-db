import { Button } from '@nextui-org/react';
import { env } from 'next-runtime-env';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { PricePlan } from '../price-plan';

interface Props {
  className?: string;
}

export const PremiumPlan: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();

  const SwitchPlan = React.useCallback(() => {
    if (plan == null) {
      return <Button isLoading />;
    } else if (plan.isActive) {
      // Already subscribed to a plan
      return <Button isDisabled>Your current plan</Button>;
    } else {
      return (
        <Button onClick={() => goToPanel('premium')}>
          Upgrade to {env('NEXT_PUBLIC_PLAN_NAME')}
        </Button>
      );
    }
  }, [plan, goToPanel]);

  return (
    <PricePlan
      className={className}
      planName={
        <div className="flex items-center gap-1">
          <Icon className="text-yellow-600" icon="premium-plan" size={20} />
          {env('NEXT_PUBLIC_PLAN_NAME')}
        </div>
      }
      price={env('NEXT_PUBLIC_PLAN_COST') ?? 'n/a'}
      button={<SwitchPlan />}
    >
      <ul className="list-disc pl-4">
        <li>Up to 5 databases</li>
        <li>Up to 1000 addresses per database</li>
      </ul>
    </PricePlan>
  );
};
