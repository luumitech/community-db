import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
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
    <div className={cn(className, 'flex-[0_0_100%]', 'space-y-5 px-2')}>
      <div className={cn('p-2 rounded-xl bg-slate-700')}>
        <Image className="rounded-lg w-full" alt={alt} {...props} />
      </div>
      {caption && (
        <div className="text-center text-xl font-bold text-foreground-700">
          {caption}
        </div>
      )}
    </div>
  );
};
