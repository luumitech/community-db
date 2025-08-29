import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
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
      className={cn(
        className,
        // Shrink slide a bit, so previous/next slide would show on either end
        'flex-[0_0_75%] max-w-4xl',
        'space-y-5 px-2',
        'transition-opacity duration-500',
        styles.slide
      )}
    >
      <div
        className={cn(
          'p-2 rounded-xl bg-slate-700',
          // If click handler is provided, change the cursor
          { 'cursor-zoom-in': !!props.onClick }
        )}
      >
        <Image className="rounded-lg" alt={alt} {...props} />
      </div>
      {caption && (
        <div className="text-center mb-5 text-xl font-bold text-slate-700">
          {caption}
        </div>
      )}
    </div>
  );
};
