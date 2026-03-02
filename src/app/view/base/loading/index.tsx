'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import styles from './styles.module.css';

interface Props {
  className?: string;
  onShown?: () => void;
}

export const Loading: React.FC<Props> = ({ className, onShown, ...props }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onShown?.();
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [onShown]);

  return (
    <div
      ref={ref}
      aria-label="Loading"
      className={twMerge('px-4 py-2 text-primary-300', className)}
      {...props}
    >
      <div className={styles.loader} />
    </div>
  );
};
