import { Button, Spacer } from '@heroui/react';
import clsx from 'clsx';
import { env } from 'next-runtime-env';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { PricePlan } from '../price-plan';
import { CancelSubscriptionButton } from './cancel-subscription';

interface Props {
  className?: string;
}

export const FreePlanConfirmation: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

  const planName = env('NEXT_PUBLIC_PLAN_FREE_NAME')!;
  const planCost = env('NEXT_PUBLIC_PLAN_FREE_COST')!;

  return (
    <div className={clsx(className, 'flex items-start')}>
      <Button
        isIconOnly
        variant="light"
        onPress={() => goToPanel('plan-select')}
      >
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
        onSuccess={() => goToPanel('free-success')}
      >
        Cancel Current Subscription
      </CancelSubscriptionButton>
    </div>
  );
};
