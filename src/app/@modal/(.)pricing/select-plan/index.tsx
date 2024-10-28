import clsx from 'clsx';
import React from 'react';
import { PlanT, SubscriptionPlan } from '../_type';
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';
import styles from './styles.module.css';

interface Props {
  className?: string;
  plan?: SubscriptionPlan;
  onSelect?: (plan: PlanT) => void;
}

export const SelectPlan: React.FC<Props> = ({ className, plan, onSelect }) => {
  return (
    <div className={clsx(className, 'grid grid-cols-2 gap-4 items-start p-2')}>
      <FreePlan
        className={styles['item-with-border']}
        plan={plan}
        onSelect={() => onSelect?.('free')}
      />
      <PremiumPlan plan={plan} onSelect={() => onSelect?.('premium')} />
    </div>
  );
};
