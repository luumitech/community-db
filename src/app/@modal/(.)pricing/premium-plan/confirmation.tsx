import { Button, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { PricePlan } from '../price-plan';
import { ProcessPaymentButton } from './process-payment-button';

interface Props {
  className?: string;
}

export const PremiumPlanConfirmation: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

  return (
    <div className={clsx(className, 'flex items-start')}>
      <Button
        isIconOnly
        variant="light"
        onClick={() => goToPanel('plan-select')}
      >
        <Icon icon="back" />
      </Button>
      <div className="mt-2">
        <p>New Plan:</p>
        <PricePlan
          price={process.env.NEXT_PUBLIC_PLAN_COST!}
          planName={process.env.NEXT_PUBLIC_PLAN_NAME}
        />
      </div>
      <Spacer x={6} />
      <ProcessPaymentButton
        className="grow self-center"
        color="primary"
        onSuccess={() => goToPanel('premium-success')}
      >
        Proceed To Payment
      </ProcessPaymentButton>
    </div>
  );
};
