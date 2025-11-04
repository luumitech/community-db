import { motion, useInView } from 'motion/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  title: string;
}

/** Display caption at the bottom of container */
export const DisplayTitle: React.FC<Props> = ({ className, title }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className={twMerge(
        'text-slate-700 dark:text-foreground',
        'text-center text-3xl font-bold sm:text-5xl',
        'my-10',
        className
      )}
    >
      {title.split('').map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.1, delay: index * 0.05 }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};
