import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';

interface Props extends ScreenshotEntry {
  imageClassName?: string;
}

/** Display image with rounded corner */
export const DisplayImage: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  imageClassName,
  id,
  alt,
  caption,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // flex container, so smaller image can grow inside container
        'relative flex',
        // hide overflow, so rounded corner are preserved
        'rounded-xl overflow-hidden',
        className
      )}
    >
      <Image
        className={cn('flex-grow object-cover', imageClassName)}
        alt={alt}
        {...props}
      />
      {children}
    </div>
  );
};
