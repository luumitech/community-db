'use client';
import { cn } from '@heroui/react';
import React from 'react';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export const Loading = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-label="Loading"
        className={cn(className, 'text-primary-300 px-4 py-2')}
        {...props}
      >
        <div className={cn(styles.loader)} />
      </div>
    );
  }
);

Loading.displayName = 'Loading';
