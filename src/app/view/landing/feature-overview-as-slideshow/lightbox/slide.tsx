import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type ScreenshotEntry } from '../../feature-overview-image-list';

export const Slide: React.FC<ScreenshotEntry> = ({
  className,
  alt,
  caption,
  ...props
}) => {
  /**
   * There is a bug in this presentation where if the screen width is too wider,
   * the image will stretch its height accordingly to the aspect ratio, and the
   * caption will be pushed off the screen.
   */
  return (
    <div className={twMerge('flex-[0_0_100%]', 'space-y-5 px-2', className)}>
      <div className={cn('rounded-xl bg-slate-700 p-2')}>
        <Image className="w-full rounded-lg" alt={alt} {...props} />
      </div>
      {caption && (
        <div className="text-center text-xl font-bold text-foreground-700">
          {caption}
        </div>
      )}
    </div>
  );
};
