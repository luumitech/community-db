import { Button, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { usePlanContext } from '../plan-context';
import { PricePlanWithDescription } from '../price-plan-with-description';

interface Props {
  className?: string;
}

export const FreePlan: React.FC<Props> = ({ className }) => {
  const { env } = useAppContext();
  const { plan, goToPanel } = usePlanContext();

  const planName = env.NEXT_PUBLIC_PLAN_FREE_NAME;
  const planCost = env.NEXT_PUBLIC_PLAN_FREE_COST;
  const maxCommunity = env.NEXT_PUBLIC_PLAN_FREE_MAX_COMMUNITY;
  const maxProperty = env.NEXT_PUBLIC_PLAN_FREE_MAX_PROPERTY;

  const SwitchPlan = React.useCallback(() => {
    if (plan == null) {
      return null;
    } else if (plan.isLoading) {
      return <Button isLoading />;
    } else if (plan.isActive) {
      // Already subscribed to a plan
      return (
        <Button onPress={() => goToPanel('free')}>
          Downgrade to {planName}
        </Button>
      );
    } else {
      return <Button isDisabled>Your current plan</Button>;
    }
  }, [plan, goToPanel, planName]);

  return (
    <PricePlanWithDescription
      className={className}
      planName={planName}
      planCost={planCost}
      maxCommunity={maxCommunity}
      maxProperty={maxProperty}
      button={<SwitchPlan />}
    />
  );
};
