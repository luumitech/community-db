import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';

interface Props {
  className?: string;
}

export const PremiumPlanSuccess: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

  return (
    <div className={cn(className, 'flex items-start')}>
      <Button
        isIconOnly
        variant="light"
        onPress={() => goToPanel('plan-select')}
      >
        <Icon icon="back" />
      </Button>
      <div className="mt-2">
        <p className="mb-2">Thank you!</p>
        <p>You have successfully subscribed to Premium Plan</p>
      </div>
    </div>
  );
};
