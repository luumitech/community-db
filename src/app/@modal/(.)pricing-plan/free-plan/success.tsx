import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';

interface Props {
  className?: string;
}

export const FreePlanSuccess: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();
  const { isActive, recurringAmount, nextBillingDate } = plan ?? {};

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
        <p className="mb-2">We are sorry to see you go.</p>
        <p>Your subscription has been successfully cancelled</p>
      </div>
    </div>
  );
};
