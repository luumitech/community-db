'use client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import type { PlanT } from './_type';
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';
import { SelectPlan } from './select-plan';
import { useSubscriptionPlan } from './use-subscription-plan';

type Direction = 'back' | 'forward';

const variants = {
  initial: (direction: Direction) => ({
    x: direction === 'forward' ? '130%' : '-130%',
  }),
  animate: {
    x: '0',
  },
  exit: (direction: Direction) => ({
    x: direction === 'forward' ? '-130%' : '130%',
  }),
};

export default function Pricing() {
  const router = useRouter();
  const plan = useSubscriptionPlan();
  const [selectedPlan, setSelectedPlan] = React.useState<PlanT>('none');

  const direction = selectedPlan === 'none' ? 'backward' : 'forward';

  return (
    <Modal
      size="xl"
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      // isKeyboardDismissDisabled
    >
      <ModalContent className="overflow-hidden">
        <ModalHeader>{appLabel('pricing')}</ModalHeader>
        <ModalBody>
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={selectedPlan}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: 0.5 }}
              variants={variants}
              custom={direction}
            >
              {selectedPlan == 'none' && (
                <SelectPlan plan={plan} onSelect={setSelectedPlan} />
              )}
              {!!plan && selectedPlan == 'free' && (
                <FreePlan plan={plan} onBack={() => setSelectedPlan('none')} />
              )}
              {!!plan && selectedPlan == 'premium' && (
                <PremiumPlan
                  plan={plan}
                  onBack={() => setSelectedPlan('none')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </ModalBody>
        <ModalFooter className="justify-center">
          Need more capabilities? Contact our team
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
