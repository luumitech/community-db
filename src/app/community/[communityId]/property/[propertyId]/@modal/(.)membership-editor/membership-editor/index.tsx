import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { useHookFormContext } from '../use-hook-form';
import { EventNameSelect } from './event-name-select';
import { MemberToggle } from './member-toggle';
import { PaymentDatePicker } from './payment-date-picker';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const MembershipEditor: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  const { watch } = useHookFormContext();
  const isMember = watch(`${membershipPrefix}.isMember`);

  return (
    <fieldset
      className={cn({
        'rounded-lg border-2 border-divider': isMember,
      })}
    >
      <legend className="ml-2 px-2 text-sm text-foreground/60">
        <MemberToggle membershipPrefix={membershipPrefix} />
      </legend>
      <AnimatePresence initial={false}>
        {isMember && (
          <motion.div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
              'm-2 gap-2',
              className
            )}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
          >
            <EventNameSelect membershipPrefix={membershipPrefix} />
            <PriceInput membershipPrefix={membershipPrefix} />
            <PaymentDatePicker
              className="max-w-xs"
              membershipPrefix={membershipPrefix}
            />
            <PaymentSelect membershipPrefix={membershipPrefix} />
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
};
