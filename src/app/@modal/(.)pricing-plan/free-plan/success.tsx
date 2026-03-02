import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { Wizard } from '../wizard';

export interface FreePlanSuccessProps {
  className?: string;
}

export const FreePlanSuccess: React.FC<FreePlanSuccessProps> = ({
  className,
}) => {
  const { goTo } = Wizard.useWizard();
  const { plan } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

  return (
    <div className={cn(className, 'flex items-start')}>
      <Button isIconOnly variant="light" onPress={() => goTo('selectPlan', {})}>
        <Icon icon="back" />
      </Button>
      <div className="mt-2">
        <p className="mb-2">We are sorry to see you go.</p>
        <p>Your subscription has been successfully cancelled</p>
      </div>
    </div>
  );
};
