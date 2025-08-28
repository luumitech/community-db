import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';

interface Props extends ScreenshotEntry {}

export const ImageWithFrame: React.FC<Props> = ({
  className,
  id,
  alt,
  caption,
  ...props
}) => {
  return (
    <div
      className={cn(className, 'relative flex', 'rounded-xl overflow-hidden')}
    >
      <Image className="flex-grow object-cover" alt={alt} {...props} />
      {!!caption && (
        <div
          className={cn(
            'absolute bottom-0 w-full',
            'flex items-center justify-center',
            'bg-foreground/60 backdrop-blur-md'
          )}
        >
          <span
            className={cn(
              'text-center text-xl font-bold text-background',
              'p-3'
            )}
          >
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};
