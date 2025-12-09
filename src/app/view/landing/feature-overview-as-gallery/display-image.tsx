import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';
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
      className={twMerge(
        // flex container, so smaller image can grow inside container
        'relative flex',
        // hide overflow, so rounded corner are preserved
        'overflow-hidden rounded-xl',
        className
      )}
    >
      <Image
        className={twMerge('grow object-cover', imageClassName)}
        alt={alt}
        {...props}
      />
      {children}
    </div>
  );
};
