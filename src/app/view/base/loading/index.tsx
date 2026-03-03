'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import styles from './styles.module.css';

interface Props {
  className?: string;
}

export const Loading: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div
      aria-label="Loading"
      className={twMerge('px-4 py-2 text-primary-300', className)}
      {...props}
    >
      <div className={styles.loader} />
    </div>
  );
};
