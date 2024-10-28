import { Button, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { SubscriptionPlan } from '../_type';
import { PricePlan } from '../price-plan';
import { CancelSubscriptionButton } from './cancel-subscription';

interface Props {
  className?: string;
  plan: SubscriptionPlan;
  onBack?: () => void;
}

export const FreePlan: React.FC<Props> = ({ className, plan, onBack }) => {
  const { isActive, recurringAmount, nextBillingDate } = plan;

  return (
    <div className={clsx(className, 'flex items-start')}>
      <Button isIconOnly variant="light" onClick={onBack}>
        <Icon icon="back" />
      </Button>
      <div>
        <p className="mt-2">New Plan:</p>
        <PricePlan price="0" planName="Free" />
      </div>
      <Spacer x={6} />
      <CancelSubscriptionButton className="grow" onSuccess={onBack}>
        Cancel Current Subscription
      </CancelSubscriptionButton>
    </div>
  );
};
