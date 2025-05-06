'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { EmailList } from './email-list';
import { FilterSelect } from './filter-select';
import { usePanelContext, type PanelProps } from './panel-context';

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
  const { panel, panelArg } = usePanelContext();
  const direction = panel === 'filter-select' ? 'backward' : 'forward';

  return (
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
        {panel === 'filter-select' && <FilterSelect />}
        {panel === 'email-list' && (
          <EmailList {...(panelArg as PanelProps['email-list'])} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
