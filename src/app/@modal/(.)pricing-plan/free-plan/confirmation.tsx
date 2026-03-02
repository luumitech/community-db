import { Button, Spacer, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { PricePlan } from '../price-plan';
import { Wizard } from '../wizard';
import { CancelSubscriptionButton } from './cancel-subscription';

export interface FreePlanConfirmationProps {
  className?: string;
}

export const FreePlanConfirmation: React.FC<FreePlanConfirmationProps> = ({
  className,
}) => {
  const { env } = useAppContext();
  const { goTo } = Wizard.useWizard();
  const { plan } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

  const planName = env.NEXT_PUBLIC_PLAN_FREE_NAME;
  const planCost = env.NEXT_PUBLIC_PLAN_FREE_COST;

  return (
    <div className={cn(className, 'flex items-start')}>
      <Button isIconOnly variant="light" onPress={() => goTo('selectPlan', {})}>
        <Icon icon="back" />
      </Button>
      <div className="mt-2">
        <p>New Plan:</p>
        <PricePlan planCost={planCost} planName={planName} />
      </div>
      <Spacer x={6} />
      <CancelSubscriptionButton
        className="grow self-center"
        color="primary"
        onSuccess={() => goTo('freeSuccess', {})}
      >
        Cancel Current Subscription
      </CancelSubscriptionButton>
    </div>
  );
};
