import clsx from 'clsx';
import React from 'react';
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export const SelectPlan: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 items-start p-2">
        <FreePlan className={styles['item-with-border']} />
        <PremiumPlan />
      </div>
      <div className="flex items-center justify-center mt-4">
        Need more capabilities? Contact our team
      </div>
    </div>
  );
};
