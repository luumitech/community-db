'use client';
import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { InitiateSignIn } from './initiate-sign-in';
import { usePanelContext, type PanelProps } from './panel-context';
import { VerifyEmailOtp } from './verify-email-otp';

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

interface Props {
  className?: string;
}

export const PanelWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  const { panel, panelArg, goToPanel } = usePanelContext();
  const direction = panel === 'sign-in' ? 'backward' : 'forward';

  return (
    <>
      {panel !== 'sign-in' && (
        <Button
          className="absolute top-4 left-4"
          variant="bordered"
          isIconOnly
          size="sm"
          startContent={<Icon icon="back" />}
          onPress={() => goToPanel('sign-in', {})}
        />
      )}
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={panel}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'tween', duration: 0.5 }}
          variants={variants}
          custom={direction}
        >
          {panel === 'sign-in' && (
            <InitiateSignIn {...(panelArg as PanelProps['sign-in'])} />
          )}
          {panel === 'verify-email-otp' && (
            <VerifyEmailOtp {...(panelArg as PanelProps['verify-email-otp'])} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
