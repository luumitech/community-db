import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type ScreenshotEntry } from '../../feature-overview-image-list';

import styles from './styles.module.css';

export const Slide: React.FC<ScreenshotEntry> = ({
  className,
  caption,
  alt,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        // Shrink slide a bit, so previous/next slide would show on either end
        'max-w-4xl flex-[0_0_75%]',
        'space-y-5 px-2',
        'transition-opacity duration-500',
        styles.slide,
        className
      )}
    >
      <div
        className={cn(
          'rounded-xl bg-slate-700 p-2',
          // If click handler is provided, change the cursor
          { 'cursor-zoom-in': !!props.onClick }
        )}
      >
        <Image className="rounded-lg" alt={alt} {...props} />
      </div>
      {caption && (
        <div className="mb-5 text-center text-xl font-bold text-slate-700">
          {caption}
        </div>
      )}
    </div>
  );
};
